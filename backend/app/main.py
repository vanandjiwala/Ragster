from fastapi import FastAPI
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.knowledge_base import router as knowledge_base_router
from app.api.v1.endpoints.document import router as document_router
from app.core.config import Settings
app = FastAPI(title="Ragster")

app.include_router(health_router, prefix="/api/v1", tags=["health"])
app.include_router(knowledge_base_router, prefix="/api/v1", tags=["KnowledgeBase"])
app.include_router(document_router, prefix="/api/v1", tags=["document"])
@app.get("/")
def read_root():
    return {"status": f"{Settings.POSTGRES_URL}"}
