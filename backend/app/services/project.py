from fastapi import FastAPI, APIRouter, HTTPException, Depends
from schemas.project import ProjectBase, ProjectCreate, ProjectResponse, ProjectUpdate
from sqlalchemy.orm import Session
from uuid import UUID
from database import get_db
from models.project import Project
from models.user import User



def create_project(user_id: UUID, project: ProjectCreate, db: Session):

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    
    existing_title = db.query(Project).filter(project.title == Project.title).first()

    if existing_title:
        raise HTTPException(status_code=400, detail="Title already in use")

    new_project = Project(
        user_id=user_id,
        title=project.title,
        description=project.description,
        blueprint=project.blueprint if project.blueprint is not None else {"nodes": [], "edges": []},
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project

def get_user_projects(user_id: UUID, db: Session):
    return db.query(Project).filter(Project.user_id == user_id).all()

def get_projects(db: Session):
    return db.query(Project).all()

def delete_project(project_id: UUID, db : Session):

    exists = db.query(Project).filter(Project.id == project_id).first()

    if not exists:
        raise HTTPException(status_code=404, detail="Project does not exist")


    db.delete(exists)
    db.commit()

    return {"detail" : "Project deleted successfully"}


def update_project(project_id: UUID, project_data: ProjectUpdate, db : Session):

    exists = db.query(Project).filter(Project.id == project_id).first()

    if not exists:
            raise HTTPException(status_code=404, detail="Project does not exist")


    update_data = project_data.model_dump(exclude_unset=True)

    for key, val in update_data.items():
        setattr(exists, key, val)


    db.commit()
    db.refresh(exists)

    return exists