from fastapi import APIRouter
from .dev import router as dev_router
from .workers import router as workers_router
from .clients import router as clients_router
from .projects import router as projects_router

api_router = APIRouter()

api_router.include_router(dev_router, prefix="/api/dev", tags=["Development"])
api_router.include_router(workers_router, prefix="/api/workers", tags=["Workers"])
api_router.include_router(clients_router, prefix="/api/clients", tags=["Clients"])
api_router.include_router(projects_router, prefix="/api/projects", tags=["Projects"])
