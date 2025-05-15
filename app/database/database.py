from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase


class Base(DeclarativeBase):
    pass

class DataBaseEngine:

    def __init__(self):
        self.SessionLocal = None
        self.engine= None

    def connect_to_database(self):
        from app.tables.tables import FILE_UPLOAD_STATUS, Differences, ParallelData, CompareSession
        self.engine = create_engine('sqlite:///database.db', echo=True)
        self.SessionLocal = sessionmaker(bind=self.engine)
        Base.metadata.create_all(self.engine)  # Create tables