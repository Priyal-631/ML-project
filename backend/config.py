import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_ENV: str = os.getenv("API_ENV", "development")
    PORT: int = int(os.getenv("PORT", 8000))
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "*")
    PREPROCESSOR_PATH: str = "artifacts/preprocessor.pkl"
    MODEL_PATH: str = "artifacts/model.pkl"

    class Config:
        env_file = ".env"

settings = Settings()