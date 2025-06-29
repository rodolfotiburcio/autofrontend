from sqlmodel import Field, SQLModel
from typing import Optional
from datetime import datetime

class ProjectBase(SQLModel):
    name: str
    client: str
    responsible: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Project(ProjectBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int

class ProjectUpdate(SQLModel):
    name: Optional[str] = None
    client: Optional[str] = None
    responsible: Optional[str] = None
