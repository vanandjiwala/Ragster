from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    display_name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    permissions = relationship("RolePermission", back_populates="role")
    user_assignments = relationship("KnowledgeBaseUserRole", back_populates="role")
