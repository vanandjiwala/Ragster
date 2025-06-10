from pydantic import BaseModel

class RoleAssignRequest(BaseModel):
    user_id: int
    knowledge_base_id: int
    role_id: int


class RoleAssignMultipleRequest(BaseModel):
    """Schema for assigning multiple roles to a user."""

    user_id: int
    knowledge_base_id: int
    role_ids: list[int]
