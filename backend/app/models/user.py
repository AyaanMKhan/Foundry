from sqlalchemy import Column, String, Integer, UUID, ForeignKey
from uuid import uuid4
from database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(primary_key=True, name="id", type_=UUID(as_uuid=True), unique=True, nullable=False, default=uuid4)
    email = Column(name="email", type_=String(255), unique=True, nullable=False, index=True)
    name = Column(name="name", type_=String(50), unique=False, nullable=False)
    google_id = Column(name="google_id", type_=String(255), unique=True, nullable=True, index=True)


    #relationship
    project_ids = relationship("Project", back_populates="user")