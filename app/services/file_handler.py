import datetime
from io import BytesIO
from typing import List

from sqlalchemy import select, func, case, or_, distinct
from sqlalchemy.orm import Session
from starlette.datastructures import UploadFile

from app.database import SessionLocal
from app.services.excel_handler import ExcelHandler
from app.tables.tables import FILE_UPLOAD_STATUS





class FileHandler:

    def __init__(self):
        self.session: Session = SessionLocal()

    def save_files_names_to_database(self, files: List[str], db_source: str):
        # conn, cursor = connect_to_db('files_status')
        inserted_ids = []
        for file in files:
            file_upload = FILE_UPLOAD_STATUS(FileName=file, SOURCE=db_source, UPLOAD_STATUS="Initiated")
            self.session.add(file_upload)
            self.session.flush()
            inserted_ids.append(file_upload.id)
        self.session.commit()
        return inserted_ids

    def update_file_upload_status(self, status, file_name, inserted_ids):
        updated_count = (
            self.session.query(FILE_UPLOAD_STATUS)
            .filter(
                FILE_UPLOAD_STATUS.FileName == file_name,
                FILE_UPLOAD_STATUS.id.in_(inserted_ids)
            )
            .update(
                {FILE_UPLOAD_STATUS.UPLOAD_STATUS: status},
                synchronize_session=False
            )
        )
        self.session.commit()
        return updated_count

    def handle_files(self, files: List[UploadFile], db_source: str, inserted_ids, date: datetime.date):
        for file in files:
            file_path = f"/tmp/{file.filename}"  # Save file temporarily

            # Save file to disk
            with open(file_path, "wb") as f:
                f.write(file.file.read())  # Correct way to read file content

            # Process file
            with open(file_path, 'rb') as f:
                status = "fail"
                try:
                    ExcelHandler().excel_to_db(BytesIO(f.read()), db_source, date)
                    status = "pass"
                except Exception as e:
                    status = "fail"
                self.update_file_upload_status(status, file.filename, inserted_ids)


    def get_file_status(self):
        result = self.session.query(FILE_UPLOAD_STATUS).all()
        data = [row.__dict__ for row in result]
        for d in data:
            d.pop('_sa_instance_state', None)
        return data

    def get_file_processing_status(self):
        result = self.session.query(
            func.count(case((FILE_UPLOAD_STATUS.UPLOAD_STATUS == 'pass', 1))).label('pass'),
            func.count(case((FILE_UPLOAD_STATUS.UPLOAD_STATUS == 'fail', 1))).label('fail'),
            func.count(
                case((
                    or_(
                        FILE_UPLOAD_STATUS.UPLOAD_STATUS == None,
                        FILE_UPLOAD_STATUS.UPLOAD_STATUS == ''
                    )
                )).label('yet')
            )
        ).one()
        pass_count, fail_count, yet_count = result
        return {"pass": pass_count, "fail": fail_count, "yet": yet_count}

    def get_distinct_sources(self):
        result = self.session.query(
            distinct(FILE_UPLOAD_STATUS.SOURCE)
        ).all()
        source = [ row[0] for row in result]
        return source