import datetime
from typing import List

from fastapi import APIRouter
from starlette.background import BackgroundTasks
from starlette.datastructures import UploadFile
from starlette.requests import Request

from app.database.database import DataBaseEngine
from app.models.model import BatchRequest, job_store
from app.services.excel_handler import ExcelHandler
from app.services.file_handler import FileHandler
from app.services.parallel_testing import ParallelTesting
from app.util.cache import put_value_to_cache


class BatchRouter:
    def __init__(self):
        self.router = APIRouter()
        self.router.add_api_route("/upload", self.update_to_database, methods=["POST"])
        self.router.add_api_route("/upload-status", self.upload_status_files, methods=["GET"])
        self.router.add_api_route("/data-source", self.distinct_data_source, methods=["GET"])
        self.router.add_api_route("/tables-list/{target}", self.get_list_of_tables, methods=["GET"])
        self.router.add_api_route("/columns", self.retrieve_columns, methods=["GET"])
        self.router.add_api_route("/compare", self.setup_batch, methods=["POST"])
        self.router.add_api_route("/compare", self.trigger_batch, methods=["GET"])
        self.router.add_api_route("/status", self.get_status, methods=["GET"])
        self.router.add_api_route("/download", self.download_excel, methods=["GET"])

    async def update_to_database(self, request: Request, background_tasks: BackgroundTasks):
        form = await request.form()  # Parse incoming form data
        files: List[UploadFile] = form.getlist("file")  # Extract multiple files
        db_source: str = form.get("db_source")  # Get db_source parameter
        file_names = [file.filename for file in files]
        inserted_ids = FileHandler().save_files_names_to_database(file_names, db_source)
        background_tasks.add_task(FileHandler().handle_files, files, db_source, inserted_ids, datetime.date.today())
        return {"message": "started"}

    async def upload_status_files(self):
        result = {"filestatus":FileHandler().get_file_status(), "status": FileHandler().get_file_processing_status()}
        return result

    async def distinct_data_source(self):
        return FileHandler().get_distinct_sources()

    async def get_list_of_tables(self, target: str):
        return ExcelHandler().get_list_tables(target, datetime.date.today())

    async def retrieve_columns(self, request: Request):
        sheet_name = 'data_' + request.query_params.get("sheetName")
        return ExcelHandler().get_col_names_from_db(sheet_name)

    async def setup_batch(self, batch_request: BatchRequest):
        put_value_to_cache('source_table', batch_request.sourceTable)
        put_value_to_cache('target_table', batch_request.targetTable)
        put_value_to_cache('excluded_column', batch_request.excludedColumns)
        put_value_to_cache('db_name', batch_request.compareSessionName.replace(" ", "_"))
        return ExcelHandler().create_batch_job_setup(
                                                     batch_request.primaryColumns)

    async def trigger_batch(self, request: Request, background_tasks: BackgroundTasks):
        job_id = request.query_params.get("jobId")
        job_store[job_id] = "in_progress"
        background_tasks.add_task(ParallelTesting().process_data, job_id)
        return {"jobId": job_id}

    async def get_status(self, request: Request):
        job_id = request.query_params.get("jobId")
        pass_count, fail_count, blank_count = ExcelHandler().get_status_job_id(job_id)
        status = job_store.get(job_id, "failed")
        return {"jobId": job_id, "ExecutionStatus": status, "Pass": pass_count,
                "Fail": fail_count, "Pending": blank_count}

    async def download_excel(self, request: Request):
        job_id = request.query_params.get("jobId")
        return ExcelHandler().export_to_excel(job_id)