from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str = "dev-secret-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    QWEN_API_KEY: str = ""
    QWEN_BASE_URL: str = "https://dashscope.aliyuncs.com/compatible-mode/v1"
    QWEN_MODEL: str = "qwen-plus"

    UPLOAD_DIR: str = "./uploads"

    model_config = {"env_file": "../.env", "extra": "ignore"}


settings = Settings()
