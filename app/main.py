import fileinput
from io import BytesIO
from typing import List

from fastapi import FastAPI, File, UploadFile, Request
from starlette.background import BackgroundTasks

# from app.batch_processing import process_items
# from app.cache import put_value_to_cache
# from app.download_files import DownloadFiles
# from app.excel_to_db import ExcelHandler
# from app.export_excel import export_to_excel
# from app.file_handler import FileHandler
# from app.logger import AppLogger
# from app.model import BatchRequest, job_store
# import os
# import io
# import aiofiles

from app.routes.batch_router import BatchRouter

app = FastAPI()

batch_router = BatchRouter()
app.include_router(batch_router.router, prefix="/batch")