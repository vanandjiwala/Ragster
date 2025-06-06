import os
from dotenv import load_dotenv
from pathlib import Path
from urllib.parse import quote_plus

# Load environment variables from .env file
load_dotenv(dotenv_path=Path(__file__).parent.parent.parent / '.env')

class Settings:
    POSTGRES_USER: str = os.getenv('POSTGRES_USER')
    POSTGRES_PASSWORD: str = os.getenv('POSTGRES_PASSWORD')
    POSTGRES_DB: str = os.getenv('POSTGRES_DB')
    POSTGRES_HOST: str = os.getenv('POSTGRES_HOST', 'localhost')
    POSTGRES_PORT: str = os.getenv('POSTGRES_PORT', '5432')
    POSTGRES_URL: str = os.getenv('POSTGRES_URL')
    SECRET_KEY: str = os.getenv('SECRET_KEY')
    DEFAULT_ROLE: str = "employee"
    DEFAULT_KB: str = "general"

settings = Settings()