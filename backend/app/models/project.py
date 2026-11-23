from sqlalchemy import Column, String, Integer, UUID, ForeignKey
from uuid import uuid4
from database import Base
from sqlalchemy.orm import relationship


class Project(Base):
    __tablename__ = "projects"

    id = Column(name="id", primary_key=True, unique=True, nullable=False, type_=UUID(as_uuid=True), default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), name="user_id", nullable=False, index=True)
    title = Column(name="title", type_=String(50), unique=True, nullable=False)
    description = Column(name="description", type_=String(255), unique=False, nullable=True)
    

    # relationship
    user = relationship("User", back_populates="project_ids")
