from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base


class KnowledgeBase(Base):
    __tablename__ = "knowledge_bases"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # One-to-many relationship with documents
    documents = relationship("Document", back_populates="knowledge_base", cascade="all, delete")

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    knowledge_base_id = Column(Integer, ForeignKey("knowledge_bases.id"), nullable=False)
    filename = Column(String, nullable=False)
    filetype = Column(String, nullable=False)   # e.g., 'csv', 'md'
    content = Column(Text, nullable=False)      # Store file content directly
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    knowledge_base = relationship("KnowledgeBase", back_populates="documents")