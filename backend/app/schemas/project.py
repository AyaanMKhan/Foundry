from typing import Optional, Any
from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID



class ProjectBase(BaseModel):
    model_config = ConfigDict(str_max_length=255, populate_by_name=True)

    id: UUID
    user_id: UUID
    title: str
    description: str | None = None
    blueprint: dict[str, Any] = {"nodes": [], "edges": []}


class ProjectCreate(BaseModel):

    title: str
    description: str | None = None
    blueprint: dict[str, Any] | None = None


class ProjectResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    title: str
    description: str | None = None
    blueprint: dict[str, Any] | None = None


class ProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    blueprint: dict[str, Any] | None = None