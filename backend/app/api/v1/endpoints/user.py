from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import User, UserCreate, Role, RoleCreate
from app.crud.user import get_users, get_user, create_user, get_roles, get_role, create_role
from app.db import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/users", response_model=list[User])
def read_users(db: Session = Depends(get_db)):
    return get_users(db)

@router.get("/users/{user_id}", response_model=User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/users", response_model=User)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    # Password hashing should be added in production
    return create_user(db, username=user.username, email=user.email, hashed_password=user.password, role_id=user.role_id)

@router.get("/roles", response_model=list[Role])
def read_roles(db: Session = Depends(get_db)):
    return get_roles(db)

@router.get("/roles/{role_id}", response_model=Role)
def read_role(role_id: int, db: Session = Depends(get_db)):
    role = get_role(db, role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role

@router.post("/roles", response_model=Role)
def create_new_role(role: RoleCreate, db: Session = Depends(get_db)):
    return create_role(db, name=role.name, description=role.description) 