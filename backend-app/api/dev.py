from fastapi import APIRouter, HTTPException
from sqlmodel import SQLModel
from core.database import engine

router = APIRouter()

@router.post("/create-db-and-tables")
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    return {"message":"Database created successfully"}

@router.post("/reset-db")
def reset_database():
    SQLModel.metadata.drop_all(engine, checkfirst=False)
    SQLModel.metadata.create_all(engine)
    return {"message": "Database reset successfully"}