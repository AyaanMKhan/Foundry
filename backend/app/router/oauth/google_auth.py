from fastapi import APIRouter, Request, Depends, HTTPException
from authlib.integrations.starlette_client import OAuthError
from sqlalchemy.orm import Session

from database import get_db
from services.oauth.google_login import oauth, get_or_create_google_user, GOOGLE_URI_REDIRECT

google_router = APIRouter(prefix="/google_auth", tags=["google_auth"])

@google_router.get("/login")
async def google_login(request: Request):
    # Builds the Google URL, saves `state` in the session, returns a 302
    return await oauth.google.authorize_redirect(request, GOOGLE_URI_REDIRECT)

@google_router.get("/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        # Checks state, swaps ?code= for tokens, verifies the id_token signature
        token = await oauth.google.authorize_access_token(request)
    except OAuthError as e:
        raise HTTPException(status_code=400, detail=e.error)

    userinfo = token["userinfo"]  # decoded id_token claims
    try:
        user = get_or_create_google_user(db, userinfo)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"id": str(user.id), "email": user.email, "name": user.name}