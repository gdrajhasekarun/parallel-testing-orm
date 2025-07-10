from urllib.request import Request

from fastapi import APIRouter

from app.services.download_files import DownloadFiles


class FeeScheduleRouter:

    def __init__(self):
        self.router = APIRouter()
        self.router.add_api_route("/fee-schedule", self.download_fee_schedule, methods=["GET"])

    async def download_fee_schedule(self, request: Request):
        return DownloadFiles().upload_files_content(request.query_params.get("theme"),
                                                    request.query_params.get("archive"))

    async def get_data_from_fee_schedule(self, request: Request):
        query_params = request.query_params
        return {"service_dates": DownloadFiles().get_value_from_database(
            query_params.get("theme"),
            query_params.get("column_name"),
            query_params.get("column_value"),
            query_params.get("date_column"),
            query_params.get("service_date"))}