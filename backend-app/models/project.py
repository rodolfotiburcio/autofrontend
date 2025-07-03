from sqlmodel import Field, SQLModel, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from enum import Enum

if TYPE_CHECKING:
    from .client import Client
    from .worker import Worker

class ProjectType(str, Enum):
    PROJECT = "Project"
    SUPPLY = "Supply"
    ADDITIONAL = "Additional"
    OTHER = "Other"

class ProjectBase(SQLModel):
    name: str
    client_id: int | None = Field(default=None, foreign_key="client.id")
    worker_id: int | None = Field(default=None, foreign_key="worker.id")
    status_id: int | None = Field(default=None, foreign_key="status.id")
    purchase_order: Optional[str] = None
    folio: Optional[str] = None
    type: Optional[ProjectType] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    directory_path: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Project(ProjectBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    client: Optional["Client"] = Relationship(back_populates="projects")
    worker: Optional["Worker"] = Relationship(back_populates="projects")
    comments: List["Comment"] = Relationship(back_populates="project")
    status: Optional["Status"] = Relationship(back_populates="projects")

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int

class ProjectUpdate(SQLModel):
    name: Optional[str] = None
    client_id: Optional[int] = None
    worker_id: Optional[int] = None
    status_id: Optional[int] = None
    purchase_order: Optional[str] = None
    folio: Optional[str] = None
    type: Optional[ProjectType] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    directory_path: Optional[str] = None

class CommentBase(SQLModel):
    project_id: int = Field(foreign_key="project.id")
    date: datetime = Field(default_factory=datetime.utcnow)
    comment: str

class Comment(CommentBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project: "Project" = Relationship(back_populates="comments")

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: int

class CommentUpdate(SQLModel):
    project_id: Optional[int] = None
    date: Optional[datetime] = None
    comment: Optional[str] = None

class StatusBase(SQLModel):
    name: str

class Status(StatusBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    projects: List["Project"] = Relationship(back_populates="status")

class StatusCreate(StatusBase):
    pass

class StatusResponse(StatusBase):
    id: int

class StatusUpdate(SQLModel):
    name: Optional[str] = None