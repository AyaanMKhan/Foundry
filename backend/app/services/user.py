from fastapi import FastAPI, APIRouter, HTTPException, Depends
from schemas.user import UserBase, UserCreate, UserResponse
from sqlalchemy.orm import Session
from database import get_db
from models.user import User




def create_user(user: UserCreate, db : Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.id == user.id).first()
    email = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already in use")

    if email:
        raise HTTPException(status_code=400, detail="Email in use")
    


    new_user = User(id=user.id, email=user.email, name=user.name, google_id=user.google_id)

    return new_user