from sqlmodel import Field, SQLModel, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from .client import Client
    from .worker import Worker

class ProjectBase(SQLModel):
    name: str
    client_id: int | None = Field(default=None, foreign_key="client.id")
    worker_id: int | None = Field(default=None, foreign_key="worker.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Project(ProjectBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    client: Optional["Client"] = Relationship(back_populates="projects")
    worker: Optional["Worker"] = Relationship(back_populates="projects")

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int

class ProjectUpdate(SQLModel):
    name: Optional[str] = None
    client_id: Optional[int] = None
    worker_id: Optional[int] = None
