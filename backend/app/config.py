from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "LINK Industrial Intelligence Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    DATABASE_URL: str = "postgresql://link_user:link_password@localhost:5432/link_platform"

    REDIS_URL: str = "redis://localhost:6379/0"

    SECRET_KEY: str = "change-this-in-production-use-a-long-random-string"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    OPENROUTER_API_KEY: Optional[str] = None

    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
