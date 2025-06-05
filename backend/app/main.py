from fastapi import FastAPI
from app.api.v1.api import api_router
from app.db import engine, Base
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(title="Ragster Backend API", lifespan=lifespan)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Hello from backend!"}
