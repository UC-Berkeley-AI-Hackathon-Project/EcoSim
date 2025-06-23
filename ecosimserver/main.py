from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os
from google import genai
from google.genai import types
import asyncio
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import requests
import json

# --- Environment and API Key Setup ---
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
VAPI_API_KEY = os.getenv("VAPI_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables. Please set it in a .env file.")

if not VAPI_API_KEY:
    print("Warning: VAPI_API_KEY not found. Text-to-speech functionality will be disabled.")

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

class ChatMessage(BaseModel):
    """Model for individual chat messages."""
    role: str  # "user", "agent_a", "agent_b"
    content: str
    timestamp: str | None = None

class ChatRequest(BaseModel):
    """Request model for chat conversations."""
    messages: list[ChatMessage]
    use_search: bool = True

class DebateResponse(BaseModel):
    """Response model containing the arguments from both agents."""
    agent_a_response: str
    agent_b_response: str
    agent_a_sources: list = []  # New field for sources
    agent_b_sources: list = []  # New field for sources
    agent_a_search_queries: list = []  # New field for search queries used
    agent_b_search_queries: list = []  # New field for search queries used

class ChatResponse(BaseModel):
    """Response model for chat conversations."""
    agent_a_response: str
    agent_b_response: str
    agent_a_sources: list = []
    agent_b_sources: list = []
    agent_a_search_queries: list = []
    agent_b_search_queries: list = []

class TextToSpeechRequest(BaseModel):
    """Request model for text-to-speech conversion."""
    text: str
    voice_id: str = "nova"  # Default VAPI voice
    model: str = "eleven-labs"  # Default VAPI model

class TextToSpeechResponse(BaseModel):
    """Response model for text-to-speech conversion."""
    audio_url: str
    success: bool
    message: str = ""

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
- IMPORTANT: When you reference statistics, data, or facts, mention the source briefly (e.g., "According to recent studies..." or "Research shows..."). If you have access to specific sources through search, reference them naturally in your argument.
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
- IMPORTANT: When you reference statistics, data, or facts, mention the source briefly (e.g., "According to recent studies..." or "Research shows..."). If you have access to specific sources through search, reference them naturally in your argument.
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
            max_output_tokens=1600,
        )

        # Create the content using proper format
        content = types.Content(
            role="user",
            parts=[types.Part(text=prompt)]
        )

        # Make the request using the new client
        response = client.models.generate_content(
            model="gemini-2.5-flash",  # Using Flash for better performance
            contents=content,
            config=config,
        )

        # Check if response and text are valid
        if not response or not hasattr(response, 'text') or response.text is None:
            return {
                "text": "I apologize, but I'm unable to generate a response at the moment. Please try again.",
                "sources": [],
                "search_queries": []
            }

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
            if hasattr(metadata, 'web_search_queries') and metadata.web_search_queries:
                result["search_queries"] = metadata.web_search_queries
            
            # Extract sources
            if hasattr(metadata, 'grounding_chunks') and metadata.grounding_chunks:
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
            "text": f"I apologize, but I encountered an error while generating a response. Please try again.",
            "sources": [],
            "search_queries": []
        }

async def generate_chat_response(messages: list[ChatMessage], system_prompt: str, use_search: bool = True) -> dict:
    """
    Generate a chat response using Gemini with conversation history.
    Returns a dict with the response text and metadata.
    """
    try:
        # Build conversation history using the proper Content format
        conversation = []
        for msg in messages:
            if msg.role == "user":
                conversation.append(types.Content(
                    role="user",
                    parts=[types.Part(text=msg.content)]
                ))
            elif msg.role == "agent_a" or msg.role == "agent_b":
                conversation.append(types.Content(
                    role="model",
                    parts=[types.Part(text=msg.content)]
                ))

        print(f"DEBUG: Conversation history length: {len(conversation)}")
        print(f"DEBUG: First message: {conversation[0] if conversation else 'None'}")

        # Configure generation settings
        tools = [grounding_tool] if use_search else []
        config = types.GenerateContentConfig(
            tools=tools,
            system_instruction=system_prompt,
            temperature=0.9,
            top_p=1,
            top_k=1,
            max_output_tokens=1600,
        )

        print(f"DEBUG: Making API call to Gemini...")
        
        # Make the request using the new client
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=conversation,
            config=config,
        )

        print(f"DEBUG: Response received: {type(response)}")
        print(f"DEBUG: Response has text attribute: {hasattr(response, 'text')}")
        if hasattr(response, 'text'):
            print(f"DEBUG: Response text is None: {response.text is None}")
            print(f"DEBUG: Response text length: {len(response.text) if response.text else 0}")

        # Check if response and text are valid
        if not response or not hasattr(response, 'text') or response.text is None:
            print(f"DEBUG: Invalid response detected")
            return {
                "text": "I apologize, but I'm unable to generate a response at the moment. Please try again.",
                "sources": [],
                "search_queries": []
            }

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
            if hasattr(metadata, 'web_search_queries') and metadata.web_search_queries:
                result["search_queries"] = metadata.web_search_queries
            
            # Extract sources
            if hasattr(metadata, 'grounding_chunks') and metadata.grounding_chunks:
                sources = []
                for chunk in metadata.grounding_chunks:
                    if hasattr(chunk, 'web') and chunk.web:
                        sources.append({
                            "title": chunk.web.title if hasattr(chunk.web, 'title') else "Unknown",
                            "uri": chunk.web.uri if hasattr(chunk.web, 'uri') else ""
                        })
                result["sources"] = sources

        print(f"DEBUG: Successfully generated response")
        return result

    except Exception as e:
        print(f"ERROR in generate_chat_response: {type(e).__name__}: {str(e)}")
        print(f"ERROR details: {e}")
        import traceback
        print(f"ERROR traceback: {traceback.format_exc()}")
        return {
            "text": f"I apologize, but I encountered an error while generating a response. Please try again.",
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

async def convert_text_to_speech(text: str, voice_id: str = "nova", model: str = "eleven-labs") -> dict:
    """
    Convert text to speech using VAPI.
    Returns a dict with the audio URL and success status.
    """
    if not VAPI_API_KEY:
        return {
            "audio_url": "",
            "success": False,
            "message": "VAPI API key not configured"
        }
    
    try:
        url = "https://api.vapi.ai/audio/generate"
        
        headers = {
            "Authorization": f"Bearer {VAPI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "text": text,
            "voice_id": voice_id,
            "model": model
        }
        
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            return {
                "audio_url": data.get("audio_url", ""),
                "success": True,
                "message": "Audio generated successfully"
            }
        else:
            return {
                "audio_url": "",
                "success": False,
                "message": f"VAPI API error: {response.status_code} - {response.text}"
            }
            
    except Exception as e:
        print(f"Error in text-to-speech conversion: {e}")
        return {
            "audio_url": "",
            "success": False,
            "message": f"Error: {str(e)}"
        }

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

@app.post("/api/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(request: ChatRequest):
    """
    Takes a conversation history and returns responses from both AI agents.
    Maintains context from previous messages for natural conversation flow.
    """
    messages = request.messages
    use_search = request.use_search
    
    if not messages:
        raise HTTPException(status_code=400, detail="Messages cannot be empty")
    
    try:
        # Run both API calls concurrently with conversation history
        agent_a_task = generate_chat_response(
            messages, 
            AGENT_A_SYSTEM_PROMPT, 
            use_search
        )
        agent_b_task = generate_chat_response(
            messages, 
            AGENT_B_SYSTEM_PROMPT, 
            use_search
        )

        result_a, result_b = await asyncio.gather(agent_a_task, agent_b_task)

        return ChatResponse(
            agent_a_response=result_a["text"],
            agent_b_response=result_b["text"],
            agent_a_sources=result_a["sources"],
            agent_b_sources=result_b["sources"],
            agent_a_search_queries=result_a["search_queries"],
            agent_b_search_queries=result_b["search_queries"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/text-to-speech", response_model=TextToSpeechResponse, tags=["Text-to-Speech"])
async def text_to_speech(request: TextToSpeechRequest):
    """
    Convert text to speech using VAPI.
    """
    try:
        result = await convert_text_to_speech(
            text=request.text,
            voice_id=request.voice_id,
            model=request.model
        )
        
        return TextToSpeechResponse(
            audio_url=result["audio_url"],
            success=result["success"],
            message=result["message"]
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