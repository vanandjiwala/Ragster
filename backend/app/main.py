from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.knowledge_base import router as knowledge_base_router
from app.api.v1.endpoints.document import router as document_router
from app.api.v1.endpoints.role import router as role_router
from app.api.v1.endpoints.permission import router as permission_router
from app.api.v1.endpoints.role_permission import router as role_permission_router
from app.api.v1.endpoints.user import router as user_router
from app.api.v1.endpoints.role_assignment import router as role_assignment_router
from app.core.config import Settings
app = FastAPI(title="Ragster")

origins = [
    "http://localhost:3000",  # Next.js dev server
    # "https://your-frontend-domain.com",  # For production, add prod domains here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],                # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],                # Allows all headers
)

app.include_router(health_router, prefix="/api/v1", tags=["health"])
app.include_router(knowledge_base_router, prefix="/api/v1", tags=["KnowledgeBase"])
app.include_router(document_router, prefix="/api/v1", tags=["document"])

app.include_router(role_router, prefix="/api/v1", tags=["role"])

app.include_router(permission_router, prefix="/api/v1", tags=["permission"])
app.include_router(role_permission_router, prefix="/api/v1", tags=["role_permission"])
app.include_router(user_router, prefix="/api/v1", tags=["user"])
app.include_router(role_assignment_router, prefix="/api/v1", tags=["role_assignment"])
@app.get("/")
def read_root():
    return {"status": f"{Settings.POSTGRES_URL}"}

