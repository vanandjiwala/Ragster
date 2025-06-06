from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class KnowledgeBaseUserRole(Base):
    __tablename__ = "knowledge_base_user_roles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    knowledge_base_id = Column(Integer, ForeignKey("knowledge_bases.id"), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    user = relationship("User", back_populates="kb_roles")
    knowledge_base = relationship("KnowledgeBase", back_populates="user_roles")
    role = relationship("Role", back_populates="user_assignments")
