from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

# Create the FastAPI app instance
app = FastAPI(
    title="PolicyPulse API",
    description="API for the PolicyPulse AI Debate Arena.",
    version="0.1.0",
)

# --- Pydantic Models ---
# These models define the shape of the data for your API requests.

class InitiateDebateRequest(BaseModel):
    """Request model for initiating a new debate."""
    user_policy_prompt: str

class InitiateDebateResponse(BaseModel):
    """Response model for a new debate, providing initial agent setup."""
    debate_id: str
    agent_a_persona: str
    agent_b_persona: str

# --- API Endpoints ---

@app.get("/", tags=["Root"])
def read_root():
    """A simple endpoint to confirm the API is running."""
    return {"status": "ok", "message": "Welcome to the PolicyPulse API!"}

# To run this application directly (for development):
if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True
    )
