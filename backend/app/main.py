from fastapi import FastAPI, APIRouter
from router import user as user_router
from fastapi.middleware.cors import CORSMiddleware
from models import user

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