from sqlmodel import SQLModel, create_engine, Session
from fastapi import Depends
from contextlib import contextmanager

DB_USER = "postgres"
DB_PASSWORD = "postgres"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "complete_db"

# Database URL
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create engine
engine = create_engine(DATABASE_URL)

# Create all tables
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    print("database created successfully")

def get_session():
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()

@contextmanager
def get_session_context():
    session = Session(engine)
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()