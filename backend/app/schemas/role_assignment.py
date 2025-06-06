from pydantic import BaseModel

class RoleAssignRequest(BaseModel):
    user_id: int
    knowledge_base_id: int
    role_id: int
