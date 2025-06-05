from sqlalchemy.orm import Session
from app.models.user import User, Role

def get_users(db: Session):
    return db.query(User).all()

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, username: str, email: str, hashed_password: str, role_id: int):
    user = User(username=username, email=email, hashed_password=hashed_password, role_id=role_id)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_roles(db: Session):
    return db.query(Role).all()

def get_role(db: Session, role_id: int):
    return db.query(Role).filter(Role.id == role_id).first()

def create_role(db: Session, name: str, description: str = None):
    role = Role(name=name, description=description)
    db.add(role)
    db.commit()
    db.refresh(role)
    return role 