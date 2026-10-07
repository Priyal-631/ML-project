from datetime import datetime
from pydantic import BaseModel, Field

class CarPredictionRequest(BaseModel):
    year: int = Field(
        ge=1990, 
        le=datetime.now().year, 
        description="Manufacturing year", 
        json_schema_extra={"example": 2018}
    )
    km_driven: int = Field(
        ge=0, 
        description="Total kilometers driven", 
        json_schema_extra={"example": 45000}
    )
    fuel: str = Field(
        description="Fuel type", 
        json_schema_extra={"example": "Diesel"}
    )
    seller_type: str = Field(
        description="Seller type", 
        json_schema_extra={"example": "Individual"}
    )
    transmission: str = Field(
        description="Transmission type", 
        json_schema_extra={"example": "Manual"}
    )
    owner: str = Field(
        description="Ownership history", 
        json_schema_extra={"example": "First Owner"}
    )
    mileage_kmpl: float = Field(
        ge=0.0, 
        description="Fuel efficiency in kmpl", 
        json_schema_extra={"example": 23.4}
    )
    engine_cc: float = Field(
        ge=500.0, 
        description="Engine displacement in CC", 
        json_schema_extra={"example": 1248.0}
    )
    max_power_bhp: float = Field(
        ge=20.0, 
        description="Maximum power in BHP", 
        json_schema_extra={"example": 74.0}
    )
    seats: float = Field(
        ge=2.0, 
        le=10.0, 
        description="Number of seats", 
        json_schema_extra={"example": 5.0}
    )

class CarPredictionResponse(BaseModel):
    status: str = Field(description="API execution status")
    predicted_price_inr: float = Field(description="Predicted price in INR")
    formatted_price: str = Field(description="Formatted string for UI display")
