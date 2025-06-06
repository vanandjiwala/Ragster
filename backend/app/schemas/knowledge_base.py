from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class KnowledgeBaseBase(BaseModel):
    name: str
    description: Optional[str] = None

class KnowledgeBaseCreate(KnowledgeBaseBase):
    pass

class KnowledgeBaseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class KnowledgeBaseOut(KnowledgeBaseBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
