# from fastapi import FastAPI, Request, HTTPException, APIRouter
# import os
# from dotenv import load_dotenv
# from jose import jwt
# from pathlib import Path
# from authlib.integrations.base_client import OAuthError
# from authlib.oauth2.rfc6749 import OAuth2Token
# from datetime import timedelta
# from typing import Annotated
# from starlette import status
# from fastapi.security import OAuth2PasswordRequestForm
# from ...models import user


# env_path = Path(__file__).resolve().parent.parent / ".env"
# load_dotenv(dotenv_path=env_path)


# GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
# GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
# GOOGLE_URI_REDIRECT = os.getenv("GOOGLE_URI_REDIRECT")


# if not all([GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_URI_REDIRECT]):

#     raise RuntimeError("Missing Google Ouath environment variables")



# ouath_router = APIRouter(prefix="/google_auth", tags=["google_auth"])



# @ouath_router("/login")
# async def login_google(request: Request):
#     return await ouath.google.authorize_redirect