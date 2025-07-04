from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.responses import JSONResponse
import os
import shutil
from sqlmodel import Session, select
from datetime import datetime
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


@router.get("/{worker_id}", response_model=WorkerResponse, operation_id="getWorker")
def get_worker(worker_id: int, session: Session = Depends(get_session)):
    worker = session.get(Worker, worker_id)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return worker


@router.put("/{worker_id}", response_model=WorkerResponse, operation_id="updateWorker")
def update_worker(worker_id: int, worker_update: WorkerUpdate, session: Session = Depends(get_session)):
    db_worker = session.get(Worker, worker_id)
    if not db_worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    worker_data = worker_update.model_dump(exclude_unset=True)
    for key, value in worker_data.items():
        setattr(db_worker, key, value)
    db_worker.updated_at = datetime.utcnow()
    session.add(db_worker)
    session.commit()
    session.refresh(db_worker)
    return db_worker


@router.post("/{worker_id}/photo", response_model=WorkerResponse, operation_id="uploadWorkerPhoto")
async def upload_worker_photo(
    worker_id: int,
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    db_worker = session.get(Worker, worker_id)
    if not db_worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    upload_dir = os.path.join(os.path.dirname(__file__), "../static/workers")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, f"{worker_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db_worker.photo_url = f"/static/workers/{worker_id}_{file.filename}"
    session.add(db_worker)
    session.commit()
    session.refresh(db_worker)
    return db_worker


@router.delete("/{worker_id}", status_code=status.HTTP_204_NO_CONTENT, operation_id="deleteWorker")
def delete_worker(worker_id: int, session: Session = Depends(get_session)):
    db_worker = session.get(Worker, worker_id)
    if not db_worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    session.delete(db_worker)
    session.commit()
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)
