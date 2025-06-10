from pydantic import BaseModel
from typing import List


class RolePermissionAssignRequest(BaseModel):
    """Request schema for assigning permissions to a role."""

    role_id: int
    permission_ids: List[int]
