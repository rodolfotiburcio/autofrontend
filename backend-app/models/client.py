from sqlmodel import Field, SQLModel, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from .project import Project

class ClientBase(SQLModel):
    name: str
    score: int
    create_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    

class Client(ClientBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    projects: List["Project"] = Relationship(back_populates="client")

class ClientCreate(ClientBase):
    pass

class ClientResponse(ClientBase):
    id: int

class ClientUpdate(SQLModel):
    name: Optional[str] = None
    score: Optional[int] = None
