from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select, delete
from models.worker import Worker, WorkerCreate, WorkerResponse, WorkerUpdate
from core.database import get_session

router = APIRouter()

@router.post("/", response_model=WorkerResponse, operation_id="createWorker")
def create_worker(worker:WorkerCreate, session: Session = Depends(get_session)):
    db_worker = Worker.model_validate(worker)
    session.add(db_worker)
    session.commit()
    session.refresh(db_worker)
    return db_worker


@router.get("/", response_model=list[WorkerResponse], operation_id="getWorkers")
def get_workers(session: Session = Depends(get_session)):
    statement = select(Worker)
    result = session.exec(statement)
    return result
