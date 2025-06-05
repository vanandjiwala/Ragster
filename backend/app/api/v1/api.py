from fastapi import APIRouter
from app.api.v1.endpoints import department_router, user_router

api_router = APIRouter()
api_router.include_router(department_router, prefix="/department", tags=["department"])
api_router.include_router(user_router, prefix="/rbac", tags=["rbac"])
