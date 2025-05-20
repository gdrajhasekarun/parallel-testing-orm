import os
from .dev import DevConfig
from .local import LocalConfig
from dotenv import load_dotenv

load_dotenv()

env = os.getenv("ENVIRONMENT", "dev")

if env == "local":
    settings = LocalConfig()
else:
    settings = DevConfig()