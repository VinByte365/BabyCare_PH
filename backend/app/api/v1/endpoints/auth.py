"""
 * BabyGuide PH — Auth Endpoints
"""

from datetime import timedelta, datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import func
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.core.config import settings
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    generate_refresh_token,
    hash_token,
    get_refresh_token_expiry,
)
from app.core.database import get_db
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.schemas.token import TokenResponse, RefreshRequest, LogoutRequest, TokenPayload

router = APIRouter()

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    if not token_data.sub:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = db.query(User).filter(User.id == token_data.sub).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user


def _create_refresh_token(db: Session, user_id: str) -> str:
    """Generate a refresh token, store its hash, and return the raw token."""
    raw = generate_refresh_token()
    tok = RefreshToken(
        user_id=user_id,
        token_hash=hash_token(raw),
        expires_at=get_refresh_token_expiry(),
    )
    db.add(tok)
    db.commit()
    return raw


def _issue_tokens(db: Session, user_id: str) -> dict:
    """Create and return access + refresh tokens."""
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access = create_access_token(user_id, expires_delta=access_token_expires)
    refresh = _create_refresh_token(db, user_id)
    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer",
    }


@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account"""
    email = user_in.email.lower()
    db_user = db.query(User).filter(func.lower(User.email) == email).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )

    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        email=email,
        hashed_password=hashed_password,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        role=user_in.role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/login", response_model=TokenResponse)
def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    """OAuth2 compatible token login, get an access token for future requests"""
    email = form_data.username.lower()
    user = db.query(User).filter(func.lower(User.email) == email).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )

    return _issue_tokens(db, user.id)


@router.post("/refresh", response_model=TokenResponse)
def refresh(body: RefreshRequest, db: Session = Depends(get_db)):
    """Exchange a valid refresh token for new access + refresh tokens (rotation)."""
    token_hash = hash_token(body.refresh_token)

    record = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.token_hash == token_hash,
            RefreshToken.revoked == False,
        )
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or revoked refresh token",
        )

    if record.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        record.revoked = True
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has expired",
        )

    # Revoke the old token (rotation)
    record.revoked = True
    db.commit()

    return _issue_tokens(db, record.user_id)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(body: LogoutRequest, db: Session = Depends(get_db)):
    """Revoke all refresh tokens for the user associated with the given token."""
    token_hash = hash_token(body.refresh_token)

    record = (
        db.query(RefreshToken)
        .filter(RefreshToken.token_hash == token_hash)
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    # Revoke all tokens for this user
    db.query(RefreshToken).filter(
        RefreshToken.user_id == record.user_id,
        RefreshToken.revoked == False,
    ).update({"revoked": True})
    db.commit()


@router.get("/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(get_current_user)):
    """Get profile of current logged-in user"""
    return current_user


@router.put("/me", response_model=UserResponse)
def update_user_me(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update profile of current logged-in user"""
    update_data = user_in.model_dump(exclude_unset=True)

    if "email" in update_data:
        email = update_data["email"].lower()
        existing = db.query(User).filter(
            func.lower(User.email) == email, User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(
                status_code=400,
                detail="This email is already in use by another account.",
            )
        update_data["email"] = email

    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
