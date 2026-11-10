import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)

def test_root_metadata_and_creator_website():
    """Verify root endpoint returns creator details and website."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["creator"]["name"] == "Thallapaka Jagadiswar"
    assert data["creator"]["website"] == "https://www.audit3a.com/"
    assert "disclaimer" in data

def test_public_registration_forces_user_role():
    """Verify public registration always creates user role, never admin."""
    reg_payload = {
        "email": "student_test@example.com",
        "full_name": "Test Student",
        "password": "Password123!"
    }
    response = client.post("/api/v1/auth/register", json=reg_payload)
    if response.status_code == 400 and "already exists" in response.text:
        # User already exists from prior run, login instead
        login_res = client.post("/api/v1/auth/login", json={"email": "student_test@example.com", "password": "Password123!"})
        data = login_res.json()
    else:
        assert response.status_code == 200
        data = response.json()
    assert data["role"] == "user"

def test_admin_endpoints_reject_unauthenticated():
    """Verify protected admin endpoints reject unauthenticated requests."""
    res = client.get("/api/v1/admin/users")
    assert res.status_code in [401, 403]

def test_admin_endpoints_reject_ordinary_user():
    """Verify ordinary user cannot access super-admin endpoints."""
    # Login as ordinary user
    login_res = client.post("/api/v1/auth/login", json={"email": "student_test@example.com", "password": "Password123!"})
    token = login_res.json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    res = client.get("/api/v1/admin/users", headers=headers)
    assert res.status_code == 403
    assert "Access denied" in res.json()["detail"]

def test_super_admin_can_access_admin_dashboard():
    """Verify seeded super admin can access admin dashboard."""
    login_res = client.post("/api/v1/auth/login", json={
        "email": settings.OWNER_EMAIL,
        "password": "Admin@CyberShield2026!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    assert login_res.json()["role"] == "super_admin"

    headers = {"Authorization": f"Bearer {token}"}
    health_res = client.get("/api/v1/admin/system-health", headers=headers)
    assert health_res.status_code == 200
    assert health_res.json()["status"] == "OPERATIONAL"

def test_ml_simulator_and_tirupati_scenario():
    """Verify ML simulator runs and reproduces high-risk Tirupati scenario."""
    res = client.get("/api/v1/simulator/preset/tirupati-scenario")
    assert res.status_code == 200
    data = res.json()
    assert data["evaluation"]["risk_band"] == "HIGH"
    assert data["evaluation"]["ml_risk_score"] >= 0.85

def test_rag_assistant_emergency_guidance():
    """Verify AI assistant provides 1930 and cybercrime.gov.in guidance."""
    res = client.post("/api/v1/assistant/chat", json={"message": "I lost money in a UPI fraud scam"})
    assert res.status_code == 200
    data = res.json()
    assert "1930" in data["response"]
    assert "https://cybercrime.gov.in/" in data["response"]
    assert data["creator_attribution"]["website"] == "https://www.audit3a.com/"

