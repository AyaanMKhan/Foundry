from uuid import UUID

from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from database import get_db
from models.user import User


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """Resolve the logged-in user from the session cookie, or 401."""
    uid = request.session.get("user_id")
    if not uid:
        raise HTTPException(status_code=401, detail="Not logged in")
    try:
        user = db.get(User, UUID(uid))
    except ValueError:
        user = None
    if not user:
        request.session.clear()
        raise HTTPException(status_code=401, detail="Not logged in")
    return user
