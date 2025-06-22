from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os
import google.generativeai as genai
import asyncio
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# --- Environment and API Key Setup ---
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables. Please set it in a .env file.")

genai.configure(api_key=GOOGLE_API_KEY)


# --- FastAPI App Initialization ---
app = FastAPI(
    title="PolicyPulse API",
    description="API for the PolicyPulse AI Debate Arena.",
    version="0.1.0",
)

# --- CORS Middleware ---
# This allows the frontend (running on a different port) to communicate with this backend.
# Using a wildcard (*) is okay for development but should be restricted in production.
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Pydantic Models ---
# These models define the shape of the data for your API requests.

class DebateRequest(BaseModel):
    """Request model for initiating a new debate."""
    prompt: str

class DebateResponse(BaseModel):
    """Response model containing the arguments from both agents."""
    agent_a_response: str
    agent_b_response: str

# --- System Prompts for AI Agents ---
# These prompts define the "persona" for each Gemini model.
AGENT_A_SYSTEM_PROMPT = """
You are an expert debater and AI assistant. Your task is to argue persuasively IN FAVOR of the user's provided policy, topic, or question. 

- Analyze the user's prompt and identify the core policy to support.
- Construct a well-reasoned, compelling argument supporting this policy.
- Use clear, confident, and persuasive language.
- Your response should be structured as a strong opening statement in a debate.
- Do not be neutral. Your entire response must be from a 'pro' perspective.
"""

AGENT_B_SYSTEM_PROMPT = """
You are an expert debater and AI assistant. Your task is to argue persuasively AGAINST the user's provided policy, topic, or question.

- Analyze the user's prompt and identify the core policy to oppose.
- Construct a well-reasoned, compelling argument opposing this policy.
- Identify potential flaws, drawbacks, or negative consequences.
- Use clear, confident, and critical language.
- Your response should be structured as a strong opening statement in a debate.
- Do not be neutral. Your entire response must be from a 'con' perspective.
"""

# --- Gemini Model Generation ---
# Shared configuration for the Gemini models
generation_config = {
  "temperature": 0.9,
  "top_p": 1,
  "top_k": 1,
  "max_output_tokens": 2048,
}

# Create two separate model instances with their respective system prompts
agent_a_model = genai.GenerativeModel(
    model_name="gemini-2.5-pro",
    generation_config=generation_config,
    system_instruction=AGENT_A_SYSTEM_PROMPT
)

agent_b_model = genai.GenerativeModel(
    model_name="gemini-2.5-pro",
    generation_config=generation_config,
    system_instruction=AGENT_B_SYSTEM_PROMPT
)


async def generate_argument(model: genai.GenerativeModel, prompt: str) -> str:
    """Helper function to generate an argument from a given model and prompt."""
    try:
        response = await model.generate_content_async(prompt)
        return response.text
    except Exception as e:
        print(f"An error occurred with the Gemini API: {e}")
        return f"Error generating response from agent: {e}"


# --- API Endpoints ---
@app.get("/", tags=["Root"])
def read_root():
    """A simple endpoint to confirm the API is running."""
    return {"status": "ok", "message": "Welcome to the PolicyPulse API!"}

@app.post("/api/debate", response_model=DebateResponse, tags=["Debate"])
async def debate(request: DebateRequest):
    """
    Takes a user's prompt and returns two opposing arguments from two AI agents.
    """
    user_prompt = request.prompt
    
    # Run both API calls concurrently and wait for their results
    try:
        agent_a_task = generate_argument(agent_a_model, user_prompt)
        agent_b_task = generate_argument(agent_b_model, user_prompt)

        response_a, response_b = await asyncio.gather(agent_a_task, agent_b_task)

        return DebateResponse(
            agent_a_response=response_a,
            agent_b_response=response_b
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Main Entry Point ---
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
