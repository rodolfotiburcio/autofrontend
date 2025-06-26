from fastapi import APIRouter
from .dev import router as dev_router
from .workers import router as workers_router

api_router = APIRouter()

api_router.include_router(dev_router, prefix="/api/dev", tags=["Development"])
api_router.include_router(workers_router, prefix="/api/workers", tags=["Workers"])