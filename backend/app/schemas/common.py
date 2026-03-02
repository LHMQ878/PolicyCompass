from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ResponseModel(BaseModel, Generic[T]):
    success: bool = True
    data: T | None = None
    message: str = ""


class PaginatedData(BaseModel, Generic[T]):
    total: int
    page: int
    page_size: int
    items: list[T]
