from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os
from google import genai
from google.genai import types
import asyncio
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# --- Environment and API Key Setup ---
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables. Please set it in a .env file.")

# Configure the client using the new genai library
client = genai.Client(api_key=GOOGLE_API_KEY)

# --- FastAPI App Initialization ---
app = FastAPI(
    title="PolicyPulse API",
    description="API for the PolicyPulse AI Debate Arena with Google Search grounding.",
    version="0.2.0",
)

# --- CORS Middleware ---
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class DebateRequest(BaseModel):
    """Request model for initiating a new debate."""
    prompt: str
    use_search: bool = True  # New field to enable/disable search grounding

class DebateResponse(BaseModel):
    """Response model containing the arguments from both agents."""
    agent_a_response: str
    agent_b_response: str
    agent_a_sources: list = []  # New field for sources
    agent_b_sources: list = []  # New field for sources
    agent_a_search_queries: list = []  # New field for search queries used
    agent_b_search_queries: list = []  # New field for search queries used

# --- System Prompts for AI Agents ---
AGENT_A_SYSTEM_PROMPT = """
You are a knowledgeable and friendly AI. Your goal is to explain the positive side of a policy or topic in a clear, conversational way. Imagine you're talking to a friend and want to show them the benefits of the user's prompt.

- Adopt a friendly, accessible, and persuasive tone. No formal debate language.
- Use facts and simple logic to support your points.
- Start your response as if you're starting a friendly conversation.
- Your entire response must be IN FAVOR of the user's topic. Think of yourself as its friendly advocate.
- When you have access to real-time information, use current data and cite recent examples to strengthen your arguments.
- CRITICAL: Keep your response to exactly 2-3 paragraphs maximum. No more, no less.
- Include 1-2 specific examples to support your arguments.
- End with a compelling summary of why this policy/topic is beneficial.
- Be concise and impactful - quality over quantity.
"""

AGENT_B_SYSTEM_PROMPT = """
You are a thoughtful and friendly AI. Your goal is to explain the potential downsides of a policy or topic in a clear, conversational way. Imagine you're talking to a friend and want to raise some valid concerns about the user's prompt.

- Adopt a friendly, reasonable, and questioning tone. No formal debate language.
- Use facts and simple logic to highlight potential drawbacks or alternative viewpoints.
- Start your response as if you're starting a friendly conversation, perhaps acknowledging the other side before presenting your concerns.
- Your entire response must be AGAINST the user's topic. Think of yourself as its friendly skeptic.
- When you have access to real-time information, use current data and cite recent examples to support your concerns.
- CRITICAL: Keep your response to exactly 2-3 paragraphs maximum. No more, no less.
- Include 1-2 specific examples to support your concerns.
- End with a compelling summary of why this policy/topic might be problematic.
- Be concise and impactful - quality over quantity.
"""

# --- Google Search Tool Configuration ---
grounding_tool = types.Tool(
    google_search=types.GoogleSearch()
)

async def generate_argument_with_search(prompt: str, system_prompt: str, use_search: bool = True) -> dict:
    """
    Generate an argument using Gemini with optional Google Search grounding.
    Returns a dict with the response text and metadata.
    """
    try:
        # Configure generation settings
        tools = [grounding_tool] if use_search else []
        config = types.GenerateContentConfig(
            tools=tools,
            system_instruction=system_prompt,
            temperature=0.9,
            top_p=1,
            top_k=1,
            max_output_tokens=2048,
        )

        # Make the request using the new client
        response = client.models.generate_content(
            model="gemini-2.5-flash",  # Using Flash for better performance
            contents=prompt,
            config=config,
        )

        result = {
            "text": response.text,
            "sources": [],
            "search_queries": []
        }

        # Extract grounding metadata if available
        if (hasattr(response, 'candidates') and 
            response.candidates and 
            hasattr(response.candidates[0], 'grounding_metadata') and
            response.candidates[0].grounding_metadata):
            
            metadata = response.candidates[0].grounding_metadata
            
            # Extract search queries
            if hasattr(metadata, 'web_search_queries'):
                result["search_queries"] = metadata.web_search_queries
            
            # Extract sources
            if hasattr(metadata, 'grounding_chunks'):
                sources = []
                for chunk in metadata.grounding_chunks:
                    if hasattr(chunk, 'web') and chunk.web:
                        sources.append({
                            "title": chunk.web.title if hasattr(chunk.web, 'title') else "Unknown",
                            "uri": chunk.web.uri if hasattr(chunk.web, 'uri') else ""
                        })
                result["sources"] = sources

        return result

    except Exception as e:
        print(f"An error occurred with the Gemini API: {e}")
        return {
            "text": f"Error generating response: {e}",
            "sources": [],
            "search_queries": []
        }

def add_citations_to_text(text: str, grounding_metadata) -> str:
    """
    Add inline citations to the response text based on grounding metadata.
    """
    if not grounding_metadata or not hasattr(grounding_metadata, 'grounding_supports'):
        return text
    
    try:
        supports = grounding_metadata.grounding_supports
        chunks = grounding_metadata.grounding_chunks

        # Sort supports by end_index in descending order to avoid shifting issues
        sorted_supports = sorted(supports, key=lambda s: s.segment.end_index, reverse=True)

        for support in sorted_supports:
            end_index = support.segment.end_index
            if support.grounding_chunk_indices:
                # Create citation string like [1][2]
                citation_links = []
                for i in support.grounding_chunk_indices:
                    if i < len(chunks):
                        citation_links.append(f"[{i + 1}]")

                citation_string = "".join(citation_links)
                text = text[:end_index] + citation_string + text[end_index:]

        return text
    except Exception as e:
        print(f"Error adding citations: {e}")
        return text

# --- API Endpoints ---
@app.get("/", tags=["Root"])
def read_root():
    """A simple endpoint to confirm the API is running."""
    return {"status": "ok", "message": "Welcome to the enhanced PolicyPulse API with Google Search grounding!"}

@app.post("/api/debate", response_model=DebateResponse, tags=["Debate"])
async def debate(request: DebateRequest):
    """
    Takes a user's prompt and returns two opposing arguments from two AI agents.
    Now with optional Google Search grounding for real-time information.
    """
    user_prompt = request.prompt
    use_search = request.use_search
    
    try:
        # Run both API calls concurrently
        agent_a_task = generate_argument_with_search(
            user_prompt, 
            AGENT_A_SYSTEM_PROMPT, 
            use_search
        )
        agent_b_task = generate_argument_with_search(
            user_prompt, 
            AGENT_B_SYSTEM_PROMPT, 
            use_search
        )

        result_a, result_b = await asyncio.gather(agent_a_task, agent_b_task)

        return DebateResponse(
            agent_a_response=result_a["text"],
            agent_b_response=result_b["text"],
            agent_a_sources=result_a["sources"],
            agent_b_sources=result_b["sources"],
            agent_a_search_queries=result_a["search_queries"],
            agent_b_search_queries=result_b["search_queries"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health", tags=["Health"])
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "search_enabled": True}

# --- Main Entry Point ---
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)