from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models import KnowledgeBaseUserRole, Role, RolePermission, Permission
from app.models.user import User
from app.core.jwt import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/user/login")  # adjust if needed

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    user = db.query(User).filter(User.id == int(payload.get("sub"))).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def require_role(required_roles: list[str]):
    def dependency(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        # Query all the roles this user has
        user_roles = (
            db.query(KnowledgeBaseUserRole)
            .filter(KnowledgeBaseUserRole.user_id == current_user.id)
            .join(Role)
            .all()
        )

        user_role_names = [ur.role.name for ur in user_roles]
        # Check if any user role matches required_roles
        if not any(r in required_roles for r in user_role_names):
            raise HTTPException(status_code=403, detail="Not authorized")
        return True
    return Depends(dependency)


def require_permission(required_permissions: list[str]):
    """Dependency to ensure the current user has at least one of the given permissions."""

    def dependency(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ):
        # Get role ids for the current user
        role_ids = [ur.role_id for ur in db.query(KnowledgeBaseUserRole).filter(
            KnowledgeBaseUserRole.user_id == current_user.id
        ).all()]

        if not role_ids:
            raise HTTPException(status_code=403, detail="Not authorized")

        perms = (
            db.query(RolePermission)
            .join(Permission, RolePermission.permission_id == Permission.id)
            .filter(RolePermission.role_id.in_(role_ids))
            .all()
        )
        permission_codes = [rp.permission.code for rp in perms]

        if not any(p in permission_codes for p in required_permissions):
            raise HTTPException(status_code=403, detail="Not authorized")
        return True

    return Depends(dependency)
