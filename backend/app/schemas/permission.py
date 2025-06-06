from pydantic import BaseModel
from typing import Optional

class PermissionBase(BaseModel):
    code: str
    display_name: str
    description: Optional[str] = None

class PermissionCreate(PermissionBase):
    pass

class PermissionUpdate(BaseModel):
    display_name: Optional[str]
    description: Optional[str]

class PermissionOut(PermissionBase):
    id: int
    class Config:
        from_attributes = True
