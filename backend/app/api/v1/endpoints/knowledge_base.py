from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import SessionLocal
from app.models.knowledge_base import KnowledgeBase
from app.schemas.knowledge_base import (
    KnowledgeBaseCreate,
    KnowledgeBaseUpdate,
    KnowledgeBaseOut,
)

router = APIRouter(prefix="/knowledgebase")

# Dependency for getting DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=KnowledgeBaseOut, status_code=status.HTTP_201_CREATED)
def create_knowledge_base(
    kb: KnowledgeBaseCreate, db: Session = Depends(get_db)
):
    db_kb = KnowledgeBase(**kb.model_dump())
    print(db_kb)
    db.add(db_kb)
    db.commit()
    db.refresh(db_kb)
    return db_kb

@router.get("/", response_model=List[KnowledgeBaseOut])
def list_knowledge_bases(db: Session = Depends(get_db)):
    return db.query(KnowledgeBase).all()

@router.get("/{kb_id}", response_model=KnowledgeBaseOut)
def get_knowledge_base(kb_id: int, db: Session = Depends(get_db)):
    kb = db.query(KnowledgeBase).filter(KnowledgeBase.id == kb_id).first()
    if not kb:
        raise HTTPException(status_code=404, detail="Knowledge base not found")
    return kb

@router.put("/{kb_id}", response_model=KnowledgeBaseOut)
def update_knowledge_base(
    kb_id: int, kb_update: KnowledgeBaseUpdate, db: Session = Depends(get_db)
):
    kb = db.query(KnowledgeBase).filter(KnowledgeBase.id == kb_id).first()
    if not kb:
        raise HTTPException(status_code=404, detail="Knowledge base not found")
    for key, value in kb_update.dict(exclude_unset=True).items():
        setattr(kb, key, value)
    db.commit()
    db.refresh(kb)
    return kb

@router.delete("/{kb_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_knowledge_base(kb_id: int, db: Session = Depends(get_db)):
    kb = db.query(KnowledgeBase).filter(KnowledgeBase.id == kb_id).first()
    if not kb:
        raise HTTPException(status_code=404, detail="Knowledge base not found")
    db.delete(kb)
    db.commit()
    return
