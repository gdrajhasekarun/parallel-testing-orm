from sqlalchemy import Column, Integer, String, Date

from app.database import Base


class FILE_UPLOAD_STATUS(Base):
    __tablename__ = 'file_upload_status'
    id = Column(Integer, primary_key=True)
    FileName = Column(String, nullable=False)
    SOURCE = Column(String, nullable=False)
    UPLOAD_STATUS = Column(String, nullable=True)


class Differences(Base):
    __tablename__ = 'differences'
    id = Column(Integer, primary_key=True, autoincrement=True)
    batch_id = Column(String, nullable=False)
    run_id = Column(Integer)
    row_index = Column(Integer)
    column_name = Column(String, nullable=True)
    old_value = Column(String, nullable=True)
    new_value = Column(String, nullable=True)

class ParallelData(Base):
    __tablename__ = 'data_source'
    d_id = Column(Integer, primary_key=True, autoincrement=True)
    d_date = Column(Date, nullable=False)
    d_data_source = Column(String, nullable=False)
    d_sheet = Column(String, nullable=False)
    Testing = Column(String, nullable=True)
    TesValue = Column(String, nullable=True)

class CompareSession(Base):
    __tablename__ = 'compare_session'
    id = Column(Integer, primary_key=True, autoincrement=True)
    created_date = Column(Date, nullable=False)
    batch_id = Column(String, nullable=False)
    unique_value = Column(String, nullable=False)
    result = Column(String, nullable=True)