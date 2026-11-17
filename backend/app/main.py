from fastapi import FastAPI, APIRouter
from router import user as user_router
from fastapi.middleware.cors import CORSMiddleware
from models.user import User
from database import Base, engine
from starlette.middleware.sessions import SessionMiddleware
from router.oauth import google_auth


Base.metadata.create_all(bind=engine)
app = FastAPI(title="Foundry")
origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)



app.include_router(user_router.user_router)
app.include_router(google_auth.google_router)
app.add_middleware(SessionMiddleware, secret_key="jadkshgefgtohewjrt80t8023t")