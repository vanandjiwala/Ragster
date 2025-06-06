from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base

class Permission(Base):
    __tablename__ = "permissions"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    display_name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    roles = relationship("RolePermission", back_populates="permission")

