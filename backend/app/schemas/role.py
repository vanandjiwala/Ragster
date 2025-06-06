from pydantic import BaseModel
from typing import Optional

class RoleBase(BaseModel):
    name: str
    display_name: str
    description: Optional[str] = None

class RoleCreate(RoleBase):
    pass

class RoleUpdate(BaseModel):
    display_name: Optional[str]
    description: Optional[str]

class RoleOut(RoleBase):
    id: int
    class Config:
        from_attributes = True
