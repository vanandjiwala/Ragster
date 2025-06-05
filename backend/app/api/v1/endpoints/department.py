from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.department import Department, DepartmentCreate
from app.crud.department import get_departments, get_department, create_department
from app.db import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/departments", response_model=list[Department])
def read_departments(db: Session = Depends(get_db)):
    return get_departments(db)

@router.get("/departments/{department_id}", response_model=Department)
def read_department(department_id: int, db: Session = Depends(get_db)):
    department = get_department(db, department_id)
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    return department

@router.post("/departments", response_model=Department)
def create_new_department(department: DepartmentCreate, db: Session = Depends(get_db)):
    return create_department(db, name=department.name, description=department.description) 