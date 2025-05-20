from pydantic.v1 import BaseSettings


class BaseConfig(BaseSettings):
    APP_NAME: str = "Parallel Testing"
    DEBUG: bool = False
    DATABASE_URL: str

    class Config:
        env_file = ".env"