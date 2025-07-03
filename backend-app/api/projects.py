from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from sqlmodel import Session, select
from models.project import Project, ProjectCreate, ProjectResponse, ProjectUpdate, Comment, CommentCreate, CommentResponse, CommentUpdate, Status, StatusCreate, StatusResponse, StatusUpdate
from core.database import get_session
from datetime import datetime

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
    result = session.exec(statement).all()
    return result

@router.get("/{project_id}", response_model=ProjectResponse, operation_id="getProject")
def get_project(project_id: int, session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.put("/{project_id}", response_model=ProjectResponse, operation_id="updateProject")
def update_project(
    project_id: int, project_update: ProjectUpdate, session: Session = Depends(get_session)
):
    db_project = session.get(Project, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    project_data = project_update.model_dump(exclude_unset=True)
    for key, value in project_data.items():
        setattr(db_project, key, value)
    db_project.updated_at = datetime.utcnow()
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project


@router.delete(
    "/{project_id}", status_code=status.HTTP_204_NO_CONTENT, operation_id="deleteProject"
)
def delete_project(project_id: int, session: Session = Depends(get_session)):
    db_project = session.get(Project, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    session.delete(db_project)
    session.commit()
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)



@router.post("/newcomment", response_model=CommentResponse, operation_id="createComment")
def create_comment(
    project_id: int, comment: CommentCreate, session: Session = Depends(get_session)
):
    # ensure the comment is linked to the provided project
    if comment.project_id != project_id:
        comment.project_id = project_id
    db_comment = Comment.model_validate(comment)
    session.add(db_comment)
    session.commit()
    session.refresh(db_comment)
    return db_comment

@router.get("/comments", response_model=list[CommentResponse], operation_id="getComments")
def get_comments(project_id: int, session: Session = Depends(get_session)):
    statement = select(Comment).where(Comment.project_id == project_id)
    return session.exec(statement).all()

@router.get("/comment/{comment_id}", response_model=CommentResponse, operation_id="getComment")
def get_comment(project_id: int, comment_id: int, session: Session = Depends(get_session)):
    comment = session.get(Comment, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.project_id != project_id:
        raise HTTPException(status_code=404, detail="Comment not found in this project")
    return comment

@router.put("/comment/{comment_id}", response_model=CommentResponse, operation_id="updateComment")
def update_comment(
    project_id: int,
    comment_id: int,
    comment_update: CommentUpdate,
    session: Session = Depends(get_session)
):
    db_comment = session.get(Comment, comment_id)
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if db_comment.project_id != project_id:
        raise HTTPException(status_code=404, detail="Comment not found in this project")
    comment_data = comment_update.model_dump(exclude_unset=True)
    for key, value in comment_data.items():
        setattr(db_comment, key, value)
    session.add(db_comment)
    session.commit()
    session.refresh(db_comment)
    return db_comment

@router.delete("/comment/{comment_id}", status_code=status.HTTP_204_NO_CONTENT, operation_id="deleteComment")
def delete_comment(project_id: int, comment_id: int, session: Session = Depends(get_session)):
    db_comment = session.get(Comment, comment_id)
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if db_comment.project_id != project_id:
        raise HTTPException(status_code=404, detail="Comment not found in this project")
    session.delete(db_comment)
    session.commit()
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)

@router.post("/newstatus", response_model=StatusResponse, operation_id="createStatus")
def create_status(status_obj: StatusCreate, session: Session = Depends(get_session)):
    db_status = Status.model_validate(status_obj)
    session.add(db_status)
    session.commit()
    session.refresh(db_status)
    return db_status

@router.get("/statuses", response_model=list[StatusResponse], operation_id="getStatuses")
def get_statuses(session: Session = Depends(get_session)):
    statement = select(Status)
    return session.exec(statement).all()

@router.get("/status/{status_id}", response_model=StatusResponse, operation_id="getStatus")
def get_status(status_id: int, session: Session = Depends(get_session)):
    status_item = session.get(Status, status_id)
    if not status_item:
        raise HTTPException(status_code=404, detail="Status not found")
    return status_item

@router.put("/status/{status_id}", response_model=StatusResponse, operation_id="updateStatus")
def update_status(status_id: int, status_update: StatusUpdate, session: Session = Depends(get_session)):
    db_status = session.get(Status, status_id)
    if not db_status:
        raise HTTPException(status_code=404, detail="Status not found")
    status_data = status_update.model_dump(exclude_unset=True)
    for key, value in status_data.items():
        setattr(db_status, key, value)
    session.add(db_status)
    session.commit()
    session.refresh(db_status)
    return db_status

@router.delete("/status/{status_id}", status_code=status.HTTP_204_NO_CONTENT, operation_id="deleteStatus")
def delete_status(status_id: int, session: Session = Depends(get_session)):
    db_status = session.get(Status, status_id)
    if not db_status:
        raise HTTPException(status_code=404, detail="Status not found")
    session.delete(db_status)
    session.commit()
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)