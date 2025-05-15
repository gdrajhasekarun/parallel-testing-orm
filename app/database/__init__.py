from .database import DataBaseEngine, Base

engine = DataBaseEngine()
engine.connect_to_database()
SessionLocal = engine.SessionLocal

def update_tables(table_name: str) -> str:
    return table_name.replace(" ", "_")