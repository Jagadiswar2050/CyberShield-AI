from typing import Dict, Any, Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.ml.fraud_detector import fraud_detector

router = APIRouter(prefix="/simulator", tags=["ML Fraud Simulator"])

class SimulationRequest(BaseModel):
    amount: float = Field(..., description="Transaction Amount in INR", ge=1.0)
    baseline_amount: float = Field(2500.0, description="Customer 30-day baseline average transaction amount")
    attempts_last_10min: int = Field(1, description="Number of transaction attempts in last 10 minutes", ge=1)
    is_new_device: bool = Field(False, description="Whether device is newly observed and unregistered")
    is_unusual_location: bool = Field(False, description="Whether GPS/IP location deviates from domestic profile")
    is_unusual_time: bool = Field(False, description="Whether transaction occurs in nocturnal high-risk window (01:00-05:00)")
    is_overseas_ip: bool = Field(False, description="Whether IP resolves to overseas VPN/Tor exit node")
    transaction_note: Optional[str] = Field("Online Digital Transfer", description="Optional note or beneficiary descriptor")

@router.post("/evaluate")
def evaluate_transaction(req: SimulationRequest):
    """
    Evaluates a synthetic transaction against both:
    1. Calibrated Machine Learning Ensemble Model (Random Forest + Gradient Boosted Trees)
    2. Heuristic Rule-Based Baseline Engine
    Returns risk probabilities, classification band, and explainable reason codes.
    """
    features = req.model_dump()
    result = fraud_detector.predict(features)
    result["input_payload"] = features
    return result

@router.get("/preset/tirupati-scenario")
def get_tirupati_scenario():
    """
    Illustrative teaching scenario from project presentation:
    Customer habitual profile: Tirupati/Chennai area, typical spend ₹2,500.
    Simulated event: ₹78,000 overseas transfer attempt, new device, 8 attempts in 2 minutes at 03:14 AM.
    """
    scenario_input = {
        "amount": 78000.0,
        "baseline_amount": 2500.0,
        "attempts_last_10min": 8,
        "is_new_device": True,
        "is_unusual_location": True,
        "is_unusual_time": True,
        "is_overseas_ip": True,
        "transaction_note": "Urgent Wire Transfer / Fictional Tirupati Teaching Scenario"
    }
    evaluation = fraud_detector.predict(scenario_input)
    return {
        "title": "Fictional Tirupati / Chennai Rapid-Burst Fraud Scenario",
        "scenario_description": (
            "Illustrative teaching example: Customer account in Tirupati with habitual average ₹2,500 "
            "suddenly presents an overseas IP request for ₹78,000 on an unrecognized device with 8 rapid bursts in 2 minutes."
        ),
        "input_features": scenario_input,
        "evaluation": evaluation,
        "teaching_note": "Notice how the ML model combines non-linear interaction terms (overseas IP + velocity surge + device mismatch) to elevate the risk score to 0.97+."
    }

@router.get("/metrics")
def get_model_evaluation_metrics():
    """Returns model validation metrics: precision, recall, F1, PR-AUC, and FPR."""
    return fraud_detector.metrics
