import os
from pathlib import Path
from dotenv import load_dotenv
from authlib.integrations.starlette_client import OAuth
from sqlalchemy.orm import Session
from models.user import User


env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=env_path)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_URI_REDIRECT = os.getenv("GOOGLE_URI_REDIRECT")

if not all([GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_URI_REDIRECT]):
    raise RuntimeError("Missing Google OAuth environment variables")


oauth = OAuth()
oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

def get_or_create_google_user(db: Session, userinfo: dict) -> User:
    google_id = userinfo["sub"]
    email = userinfo.get("email")

    if not userinfo.get("email_verified"):
        raise ValueError("Google account email is not verified")

    # A) Seen this Google account before, so it's a LOGIN
    user = db.query(User).filter(User.google_id == google_id).first()
    if user:
        return user

    # B) Email already exists (e.g. made via /create_user), so LINK Google to it
    user = db.query(User).filter(User.email == email).first()
    if user:
        user.google_id = google_id
    else:
        # C) Brand new person, so SIGN UP
        user = User(
            email=email,
            name=(userinfo.get("name") or email.split("@")[0])[:50],  # your column is String(50)
            google_id=google_id,
        )
        db.add(user)

    db.commit()
    db.refresh(user)
    return user