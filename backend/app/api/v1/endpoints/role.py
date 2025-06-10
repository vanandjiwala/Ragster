from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.deps import require_role
from app.db.session import SessionLocal
from app.models.role import Role
from app.schemas.role import RoleCreate, RoleUpdate, RoleOut

router = APIRouter(prefix="/role")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/",
             response_model=RoleOut,
             status_code=status.HTTP_201_CREATED,
             dependencies=[require_role(["admin", "super_admin"])])
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    db_role = Role(**role.model_dump())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

@router.get("/",
            response_model=List[RoleOut],
            dependencies=[require_role(["admin", "super_admin"])])
def list_roles(db: Session = Depends(get_db)):
    return db.query(Role).all()

@router.get("/{role_id}",
            response_model=RoleOut,
            dependencies=[require_role(["admin", "super_admin"])])
def get_role(role_id: int, db: Session = Depends(get_db)):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role

@router.put("/{role_id}",
            response_model=RoleOut,
            dependencies=[require_role(["admin", "super_admin"])])
def update_role(role_id: int, role_update: RoleUpdate, db: Session = Depends(get_db)):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    for key, value in role_update.dict(exclude_unset=True).items():
        setattr(role, key, value)
    db.commit()
    db.refresh(role)
    return role

@router.delete("/{role_id}",
               status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[require_role(["admin", "super_admin"])])
def delete_role(role_id: int, db: Session = Depends(get_db)):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    db.delete(role)
    db.commit()
    return