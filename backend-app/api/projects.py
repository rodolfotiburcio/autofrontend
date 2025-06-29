from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from models.project import Project, ProjectCreate, ProjectResponse
from core.database import get_session

router = APIRouter()

@router.post("/", response_model=ProjectResponse, operation_id="createProject")
def create_project(project: ProjectCreate, session: Session = Depends(get_session)):
    db_project = Project.model_validate(project)
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project

@router.get("/", response_model=list[ProjectResponse], operation_id="getProjects")
def get_projects(session: Session = Depends(get_session)):
    statement = select(Project)
    result = session.exec(statement)
    return result
