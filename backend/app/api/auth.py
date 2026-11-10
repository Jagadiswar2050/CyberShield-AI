from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User, UserRole, AuditLog
from app.core.security import hash_password, verify_password, create_access_token
from app.core.rbac import get_current_user, require_super_admin
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    full_name: str
    role: str
    owner_website: str = settings.OWNER_WEBSITE

class RoleUpdateRequest(BaseModel):
    user_id: int
    new_role: str # 'reviewer' or 'user'

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    if len(user_in.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")

    # CRITICAL SECURITY RULE: Public registration ALWAYS assigns 'user' role.
    # No user can ever register as super_admin or reviewer through the public register API.
    new_user = User(
        email=user_in.email.lower(),
        full_name=user_in.full_name,
        hashed_password=hash_password(user_in.password),
        role=UserRole.USER,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(subject=new_user.email, role=new_user.role)
    return TokenResponse(
        access_token=token,
        user_id=new_user.id,
        email=new_user.email,
        full_name=new_user.full_name,
        role=new_user.role
    )

@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email.lower()).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated. Contact the Super Admin.")

    user.last_login = datetime.now(timezone.utc)
    db.commit()

    token = create_access_token(subject=user.email, role=user.role)
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role
    )

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at,
        "owner_attribution": {
            "name": settings.OWNER_NAME,
            "website": settings.OWNER_WEBSITE
        }
    }

@router.post("/update-role", dependencies=[Depends(require_super_admin)])
def update_user_role(
    req: RoleUpdateRequest,
    current_admin: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """SUPER ADMIN ONLY: Assigns reviewer or user role."""
    target_user = db.query(User).filter(User.id == req.user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Target user not found.")

    if req.new_role not in [UserRole.REVIEWER, UserRole.USER]:
        raise HTTPException(status_code=400, detail="Only 'reviewer' or 'user' roles may be assigned.")

    # Guard owner account
    if target_user.email == settings.OWNER_EMAIL:
        raise HTTPException(status_code=400, detail="Cannot alter Super Admin status of the project owner.")

    old_role = target_user.role
    target_user.role = req.new_role
    
    # Audit log
    audit = AuditLog(
        actor_email=current_admin.email,
        action="UPDATE_USER_ROLE",
        resource_type="User",
        resource_id=str(target_user.id),
        details=f"Changed role for {target_user.email} from {old_role} to {req.new_role}"
    )
    db.add(audit)
    db.commit()

    return {"message": f"Successfully updated role for {target_user.email} to {req.new_role}"}

