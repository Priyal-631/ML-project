from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "documentation" in response.json()

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"

def test_predict_endpoint_mock():
    payload = {
        "year": 2018,
        "km_driven": 45000,
        "fuel": "Diesel",
        "seller_type": "Individual",
        "transmission": "Manual",
        "owner": "First Owner",
        "mileage_kmpl": 23.4,
        "engine_cc": 1248.0,
        "max_power_bhp": 74.0,
        "seats": 5.0
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_price_inr" in data
    assert "formatted_price" in data

def test_predict_endpoint_validation_error():
    payload = {"year": 1800, "km_driven": -50}
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
