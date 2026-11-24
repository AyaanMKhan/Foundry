from fastapi import FastAPI, APIRouter, HTTPException, Depends
from database import get_db
from services import user as user_service
from models.user import User
from schemas.user import UserCreate, UserResponse, UserBase
from sqlalchemy.orm import Session


user_router = APIRouter()

@user_router.post("/create_user", status_code=201, response_model=UserResponse)
def create_user(payload: UserCreate, db : Session = Depends(get_db)):
    try:
        return user_service.create_user(payload, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@user_router.get("/users")
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()