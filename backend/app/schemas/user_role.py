from pydantic import BaseModel
from typing import Optional

class UserRoleOut(BaseModel):
    knowledge_base_id: int
    knowledge_base_name: Optional[str]
    role_id: Optional[int]
    role_name: Optional[str]
    role_display_name: Optional[str]
