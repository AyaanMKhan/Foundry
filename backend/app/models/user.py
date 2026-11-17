from pydantic import BaseModel
from sqlalchemy import Column, String, Integer, UUID
from uuid import uuid4
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(primary_key=True, name="id", type_=UUID(as_uuid=True), unique=True, nullable=False, default=uuid4)
    email = Column(name="email", type_=String(255), unique=True, nullable=False, index=True)
    name = Column(name="name", type_=String(50), unique=False, nullable=False)
    google_id = Column(name="google_id", type_=String(255), unique=True, nullable=True, index=True)
