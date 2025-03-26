# test_integration.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_run_script_integration():
    response = client.get("/run-crawler")
    assert response.status_code == 200
    assert "message" in response.json()