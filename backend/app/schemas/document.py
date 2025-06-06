from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DocumentBase(BaseModel):
    filename: str
    filetype: str  # 'csv' or 'md'
    content: str

class DocumentCreate(DocumentBase):
    knowledge_base_id: int

class DocumentOut(DocumentBase):
    id: int
    uploaded_at: datetime
    knowledge_base_id: int

    class Config:
        from_attributes = True
