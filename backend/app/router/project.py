from fastapi import FastAPI, APIRouter, HTTPException, Depends
from database import get_db

from models.project import Project
from uuid import UUID
from schemas.project import ProjectBase, ProjectCreate, ProjectResponse, ProjectUpdate
from sqlalchemy.orm import Session
from services import project as project_service
from dependencies import get_current_user
from models.user import User


project_router = APIRouter(prefix="/project")


@project_router.post("/create", status_code=201, response_model=ProjectResponse)
def create_project(project: ProjectCreate, user: User = Depends(get_current_user), db : Session = Depends(get_db)):
    try:
        return project_service.create_project(user.id, project, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@project_router.get("/mine", response_model=list[ProjectResponse])
def get_my_projects(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return project_service.get_user_projects(user.id, db)


@project_router.get("/projects", status_code=201)
def get_projects(db: Session = Depends(get_db)):
    try:
        return project_service.get_projects(db)
    except ValueError:
        raise HTTPException(status_code=404, detail="No projects")


@project_router.delete("/delete_project", status_code=201)
def delete_project(project_id: UUID, db : Session = Depends(get_db)):
    try:
        return project_service.delete_project(project_id, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@project_router.put("/update_project", status_code=201)
def update_project(project_id: UUID, project_data: ProjectUpdate, db : Session = Depends(get_db)):
    try:
        return project_service.update_project(project_id, project_data, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))