from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import List

from starlette.responses import Response

from app.core.deps import get_current_user
from app.db.session import SessionLocal
from app.models import User, KnowledgeBaseUserRole
from app.models.knowledge_base import Document, KnowledgeBase
from app.schemas.document import DocumentCreate, DocumentOut

router = APIRouter(prefix="/document")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
async def create_document(
    knowledge_base_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    kb = db.query(KnowledgeBase).filter(KnowledgeBase.id == knowledge_base_id).first()
    if not kb:
        raise HTTPException(status_code=404, detail="Knowledge base not found")

    content = (await file.read()).decode("utf-8")
    filename = file.filename
    # infer filetype (for now, use extension)
    filetype = filename.split('.')[-1].lower()
    if filetype not in {"md", "csv"}:
        raise HTTPException(status_code=400, detail="Only markdown (.md) and csv (.csv) files are supported.")

    db_doc = Document(
        knowledge_base_id=knowledge_base_id,
        filename=filename,
        filetype=filetype,
        content=content,
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

@router.get("/",
            response_model=List[DocumentOut])
def list_documents(db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)
                   ):
    kb_ids = db.query(KnowledgeBaseUserRole.knowledge_base_id).filter(
        KnowledgeBaseUserRole.user_id == current_user.id
    ).all()
    kb_ids = [row[0] for row in kb_ids]
    documents = db.query(Document).filter(Document.knowledge_base_id.in_(kb_ids)).all()
    return documents


@router.get("/{doc_id}", response_model=DocumentOut)
def get_document(
        doc_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Check if the user has access to the knowledge base this doc belongs to
    has_access = db.query(KnowledgeBaseUserRole).filter(
        KnowledgeBaseUserRole.user_id == current_user.id,
        KnowledgeBaseUserRole.knowledge_base_id == doc.knowledge_base_id
    ).first()
    if not has_access:
        raise HTTPException(status_code=403, detail="Not authorized to access this document")

    return doc

@router.put("/{doc_id}", response_model=DocumentOut)
def update_document(
    doc_id: int,
    doc_update: DocumentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    # Check user access
    has_access = db.query(KnowledgeBaseUserRole).filter(
        KnowledgeBaseUserRole.user_id == current_user.id,
        KnowledgeBaseUserRole.knowledge_base_id == doc.knowledge_base_id
    ).first()
    if not has_access:
        raise HTTPException(status_code=403, detail="Not authorized to update this document")
    # If you want stricter: check for a specific role or permission here

    for key, value in doc_update.dict(exclude_unset=True).items():
        setattr(doc, key, value)
    db.commit()
    db.refresh(doc)
    return doc

@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    doc_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    # Check user access
    has_access = db.query(KnowledgeBaseUserRole).filter(
        KnowledgeBaseUserRole.user_id == current_user.id,
        KnowledgeBaseUserRole.knowledge_base_id == doc.knowledge_base_id
    ).first()
    if not has_access:
        raise HTTPException(status_code=403, detail="Not authorized to delete this document")
    # If you want stricter: check for a specific role or permission here

    db.delete(doc)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

