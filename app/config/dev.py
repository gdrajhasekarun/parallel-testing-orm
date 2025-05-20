from app.config.base import BaseConfig


class DevConfig(BaseConfig):
    DEBUG = True

    class Config:
        env_file = ".env.dev"