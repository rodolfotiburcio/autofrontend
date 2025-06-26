from sqlmodel import Field, SQLModel, Relationship
from typing import Optional, List
from datetime import datetime

class WorkerBase(SQLModel):
    name: str
    parental_surname: str
    maternal_surname: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Worker(WorkerBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class WorkerCreate(WorkerBase):
    pass

class WorkerResponse(WorkerBase):
    id: int

class WorkerUpdate(SQLModel):
    name: Optional[str] = None
    parental_surname: Optional[str] = None
    maternal_surname: Optional[str] = None
