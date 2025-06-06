from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.config import Settings
from app.db.session import SessionLocal
from app.models import Role, KnowledgeBase, KnowledgeBaseUserRole
from app.models.user import User
from app.schemas.user import UserCreate, UserOut
from app.core.security import hash_password

from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import verify_password
from app.core.jwt import create_access_token

router = APIRouter(prefix="/user")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    db_user = User(username=user.username, email=user.email, hashed_password=hash_password(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    default_role = db.query(Role).filter(Role.name == Settings.DEFAULT_ROLE).first()
    if not default_role:
        raise HTTPException(status_code=500, detail="Default role not found")

    default_kb = db.query(KnowledgeBase).filter(KnowledgeBase.name == Settings.DEFAULT_KB).first()
    if not default_kb:
        raise HTTPException(status_code=500, detail="Default Knowledge Base not found")
    kb_user_role = KnowledgeBaseUserRole(
        user_id=db_user.id,
        knowledge_base_id=default_kb.id,
        role_id=default_role.id
    )
    db.add(kb_user_role)
    db.commit()
    db.refresh(kb_user_role)
    return db_user

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}