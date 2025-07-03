from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from sqlmodel import Session, select
from datetime import datetime
from models.client import Client, ClientCreate, ClientResponse, ClientUpdate
from core.database import get_session

router = APIRouter()

@router.post("/", response_model=ClientResponse, operation_id="createClient")
def create_client(client: ClientCreate, session: Session = Depends(get_session)):
    db_client = Client.model_validate(client)
    session.add(db_client)
    session.commit()
    session.refresh(db_client)
    return db_client

@router.get("/", response_model=list[ClientResponse], operation_id="getClients")
def get_clients(session: Session = Depends(get_session)):
    statement = select(Client)
    result = session.exec(statement).all()
    return result

@router.get("/{client_id}", response_model=ClientResponse, operation_id="getClient")
def get_client(client_id: int, session: Session = Depends(get_session)):
    client = session.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@router.put("/{client_id}", response_model=ClientResponse, operation_id="updateClient")
def update_client(
    client_id: int, client_update: ClientUpdate, session: Session = Depends(get_session)
):
    db_client = session.get(Client, client_id)
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    client_data = client_update.model_dump(exclude_unset=True)
    for key, value in client_data.items():
        setattr(db_client, key, value)
    db_client.updated_at = datetime.utcnow()
    session.add(db_client)
    session.commit()
    session.refresh(db_client)
    return db_client

@router.delete(
    "/{client_id}", status_code=status.HTTP_204_NO_CONTENT, operation_id="deleteClient"
)
def delete_client(client_id: int, session: Session = Depends(get_session)):
    db_client = session.get(Client, client_id)
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    session.delete(db_client)
    session.commit()
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)
