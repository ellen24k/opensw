# test_main.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "/docs 에서 API 문서를 확인하세요."}

def test_make_json():
    response = client.get("/make-json")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_make_json_type1():
    response = client.get("/make-json-type1")
    assert response.status_code == 200
    assert isinstance(response.json(), list)