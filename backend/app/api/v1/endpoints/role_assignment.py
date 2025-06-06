from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.deps import require_role
from app.db.session import SessionLocal
from app.models.knowledge_base_user_role import KnowledgeBaseUserRole
from app.models.user import User
from app.models.role import Role
from app.models.knowledge_base import KnowledgeBase
from app.schemas.role_assignment import RoleAssignRequest

router = APIRouter(prefix="/role-assignment")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/assign",
             status_code=status.HTTP_200_OK,
             dependencies=[require_role(["admin", "super_admin"])])
def assign_role(data: RoleAssignRequest, db: Session = Depends(get_db)):
    """
    Assign role to user
    """
    user = db.query(User).filter(User.id == data.user_id).first()
    kb = db.query(KnowledgeBase).filter(KnowledgeBase.id == data.knowledge_base_id).first()
    role = db.query(Role).filter(Role.id == data.role_id).first()
    if not user or not kb or not role:
        raise HTTPException(status_code=404, detail="User, KB, or Role not found")

    # Check if assignment exists; update or create
    assignment = db.query(KnowledgeBaseUserRole).filter_by(
        user_id=data.user_id,
        knowledge_base_id=data.knowledge_base_id
    ).first()

    if assignment:
        assignment.role_id = data.role_id
    else:
        assignment = KnowledgeBaseUserRole(
            user_id=data.user_id,
            knowledge_base_id=data.knowledge_base_id,
            role_id=data.role_id
        )
        db.add(assignment)

    db.commit()
    return {"message": "Role assigned successfully"}


@router.delete(
    "/delete",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[require_role(["admin", "super_admin"])]
)
def delete_role_assignment(
        user_id: int = Query(..., description="User ID"),
        knowledge_base_id: int = Query(..., description="Knowledge Base ID"),
        db: Session = Depends(get_db)
):
    assignment = db.query(KnowledgeBaseUserRole).filter_by(
        user_id=user_id,
        knowledge_base_id=knowledge_base_id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Role assignment not found")

    db.delete(assignment)
    db.commit()
    return