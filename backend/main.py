import os
import joblib
from contextlib import asynccontextmanager
from datetime import datetime
import pandas as pd
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from schemas import CarPredictionRequest, CarPredictionResponse
from config import settings

preprocessor = None
model = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global preprocessor, model
    if os.path.exists(settings.PREPROCESSOR_PATH) and os.path.exists(settings.MODEL_PATH):
        try:
            preprocessor = joblib.load(settings.PREPROCESSOR_PATH)
            model = joblib.load(settings.MODEL_PATH)
            print("Successfully loaded ML model and preprocessor artifacts.")
        except Exception as e:
            print(f"Error loading artifacts: {e}")
    else:
        print("Warning: Artifacts not found. API is running in MOCK MODE.")
    yield

app = FastAPI(
    title="CarDekho Used Car Price Prediction API",
    version="1.0.0",
    description="Backend API service providing real-time ML-powered car valuations.",
    lifespan=lifespan
)

origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", status_code=status.HTTP_200_OK)
def root():
    return {
        "message": "CarDekho Used Car Price Prediction API is active.",
        "documentation": "/docs",
        "health_check": "/health"
    }

@app.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    return {
        "status": "online",
        "artifacts_loaded": preprocessor is not None and model is not None,
        "environment": settings.API_ENV
    }

@app.post("/predict", response_model=CarPredictionResponse)
def predict_price(payload: CarPredictionRequest):
    try:
        input_data = payload.model_dump()
        current_year = datetime.now().year
        input_data['car_age'] = current_year - input_data['year']
        
        df_input = pd.DataFrame([input_data])
        
        if preprocessor is not None and model is not None:
            X_transformed = preprocessor.transform(df_input)
            prediction = model.predict(X_transformed)[0]
            predicted_val = round(float(prediction), 2)
            status_str = "success"
        else:
            predicted_val = 550000.00
            status_str = "success (mock mode)"

        formatted_str = f"₹{predicted_val:,.2f}"

        return CarPredictionResponse(
            status=status_str,
            predicted_price_inr=predicted_val,
            formatted_price=formatted_str
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}"
        )
