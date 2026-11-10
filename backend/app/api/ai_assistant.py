from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.knowledge.rag_engine import rag_engine

router = APIRouter(prefix="/assistant", tags=["AI Cyber Safety Assistant"])

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=2, max_length=1000, description="User question or fraud inquiry")

@router.post("/chat")
def chat_with_assistant(req: ChatRequest):
    """
    RAG-grounded Cyber Safety & UPI Fraud Advisor.
    Strictly forbids asking for OTP/PIN, provides direct links to 1930 and cybercrime.gov.in.
    """
    return rag_engine.generate_response(req.message)
