from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.deps import require_role
from app.db.session import SessionLocal
from app.models.permission import Permission
from app.schemas.permission import PermissionCreate, PermissionUpdate, PermissionOut

router = APIRouter(prefix="/permission")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/",
             response_model=PermissionOut,
             status_code=status.HTTP_201_CREATED,
             dependencies=[require_role(["admin", "super_admin"])])
def create_permission(permission: PermissionCreate, db: Session = Depends(get_db)):
    db_perm = Permission(**permission.dict())
    db.add(db_perm)
    db.commit()
    db.refresh(db_perm)
    return db_perm

@router.get("/",
            response_model=List[PermissionOut],
            dependencies=[require_role(["admin", "super_admin"])])
def list_permissions(db: Session = Depends(get_db)):
    return db.query(Permission).all()

@router.get("/{permission_id}",
            response_model=PermissionOut,
            dependencies=[require_role(["admin", "super_admin"])])
def get_permission(permission_id: int, db: Session = Depends(get_db)):
    perm = db.query(Permission).filter(Permission.id == permission_id).first()
    if not perm:
        raise HTTPException(status_code=404, detail="Permission not found")
    return perm

@router.put("/{permission_id}",
            response_model=PermissionOut,
            dependencies=[require_role(["admin", "super_admin"])])
def update_permission(permission_id: int, permission_update: PermissionUpdate, db: Session = Depends(get_db)):
    perm = db.query(Permission).filter(Permission.id == permission_id).first()
    if not perm:
        raise HTTPException(status_code=404, detail="Permission not found")
    for key, value in permission_update.dict(exclude_unset=True).items():
        setattr(perm, key, value)
    db.commit()
    db.refresh(perm)
    return perm

@router.delete("/{permission_id}",
               status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[require_role(["admin", "super_admin"])])
def delete_permission(permission_id: int, db: Session = Depends(get_db)):
    perm = db.query(Permission).filter(Permission.id == permission_id).first()
    if not perm:
        raise HTTPException(status_code=404, detail="Permission not found")
    db.delete(perm)
    db.commit()
    return
