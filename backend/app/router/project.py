from fastapi import FastAPI, APIRouter, HTTPException, Depends
from database import get_db

from models.project import Project
from uuid import UUID
from schemas.project import ProjectBase, ProjectCreate, ProjectResponse
from sqlalchemy.orm import Session
from services import project as project_service


project_router = APIRouter(prefix="/project")


@project_router.post("/create")
def create_project(user_id: UUID, project: ProjectCreate, db : Session = Depends(get_db)):
    try:
        return project_service.create_project(user_id, project, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@project_router.get("/projects")
def get_projects(db: Session = Depends(get_db)):
    try:
        return project_service.get_projects(db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail="No projects")