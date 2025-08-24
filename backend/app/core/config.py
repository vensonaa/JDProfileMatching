import os
from pydantic import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # API Configuration
    api_v1_str: str = "/api/v1"
    project_name: str = "JD Profile Matching"
    
    # Database
    database_url: str = "sqlite:///./jd_matching.db"
    
    # Groq Configuration
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    groq_model: str = "llama3-8b-8192"
    
    # File Upload
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_file_types: list = [".pdf", ".docx", ".doc"]
    
    # LangGraph Configuration
    max_retries: int = 3
    timeout: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()
