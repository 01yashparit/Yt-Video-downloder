import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    DOWNLOAD_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../downloads"))
    TEMP_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../temp"))
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
