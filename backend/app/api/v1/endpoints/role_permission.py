from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.deps import require_role, get_db
from app.models import Role, Permission, RolePermission
from app.schemas.permission import PermissionOut
from app.schemas.role_permission import RolePermissionAssignRequest

router = APIRouter(prefix="/role-permission")


@router.post(
    "/assign",
    status_code=status.HTTP_200_OK,
    dependencies=[require_role(["admin", "super_admin"])]
)
def assign_permissions_to_role(
    data: RolePermissionAssignRequest,
    db: Session = Depends(get_db),
):
    """Attach a list of permissions to a role."""
    role = db.query(Role).filter(Role.id == data.role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    for perm_id in data.permission_ids:
        perm = db.query(Permission).filter(Permission.id == perm_id).first()
        if not perm:
            continue
        existing = (
            db.query(RolePermission)
            .filter(
                RolePermission.role_id == data.role_id,
                RolePermission.permission_id == perm_id,
            )
            .first()
        )
        if not existing:
            db.add(RolePermission(role_id=data.role_id, permission_id=perm_id))

    db.commit()
    return {"message": "Permissions assigned"}


@router.get(
    "/{role_id}",
    response_model=List[PermissionOut],
    dependencies=[require_role(["admin", "super_admin"])]
)
def list_role_permissions(role_id: int, db: Session = Depends(get_db)):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return [rp.permission for rp in role.permissions]
