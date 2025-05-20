from app.config.base import BaseConfig
from dotenv import load_dotenv

class LocalConfig(BaseConfig):
    DEBUG = True

    class Config:
        env_file = ".env.local"