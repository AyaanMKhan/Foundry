from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID




class UserBase(BaseModel):
    model_config = ConfigDict(str_max_length=255, populate_by_name=True, from_attributes=True)

    id: UUID
    email: str
    name: str
    google_id: str | None = None


class UserCreate(UserBase):
    email: str
    name: str


class UserResponse(UserBase):
    id: UUID
    email: str
    name: str
