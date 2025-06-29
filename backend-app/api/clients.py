from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from sqlmodel import Session, select
from datetime import datetime
from models.client import Client, ClientCreate, ClientResponse, ClientUpdate
from core.database import get_session

router = APIRouter()

@router.post("/", response_model=ClientResponse, operation_id="createClient")
def create_client(client:ClientCreate, session: Session = Depends(get_session)):
    db_client = Client.model_validate(client)
    session.add(db_client)
    session.commit()
    session.refresh(db_client)
    return db_client

@router.get("/", response_model=list[ClientResponse], operation_id="getClients")
def get_clients(session: Session = Depends(get_session)):
    statement = select(Client)
    result = session.exec(statement)
    return result