import datetime

from sqlalchemy import MetaData, inspect, and_, select, update

from app.database import engine, SessionLocal
from app.tables.tables import CompareSession, ParallelData, Differences
from app.util.cache import get_cache_value
import ast
from deepdiff import DeepDiff

class ParallelTesting:


    def __init__(self):
        self.metadata = MetaData()
        self.inspector = inspect(engine.engine)
        self.session = SessionLocal()

    def _orm_list_to_dicts(self, data):
        return [
            {k: v for k, v in obj.__dict__.items() if not k.startswith('_')}
            for obj in data
        ]

    def process_data(self, job_id: str):
        source_table = get_cache_value("source_table")
        target_table = get_cache_value("target_table")
        excluded_column = get_cache_value("excluded_column")
        db_name = get_cache_value("db_name")
        result = self.session.query(
            CompareSession
        ).filter(
            CompareSession.batch_id == job_id
        ).all()
        for res in result:
            unique = res.unique_value
            unique_dict = ast.literal_eval(unique)
            filters = [getattr(ParallelData, key) == value for key, value in unique_dict.items()]

            source_extra_filter = and_(
                ParallelData.d_date == datetime.date.today(),
                ParallelData.d_data_source.ilike(source_table)
            )

            source_stmt = select(ParallelData).where(*(filters + [source_extra_filter]))
            source_data = self.session.execute(source_stmt).scalars().all()

            target_extra_filter = and_(
                ParallelData.d_date == datetime.date.today(),
                ParallelData.d_data_source.ilike(source_table)
            )

            target_stmt = select(ParallelData).where(*(filters + [target_extra_filter]))
            target_data = self.session.execute(target_stmt).scalars().all()
            diff = DeepDiff(self._orm_list_to_dicts(source_data), self._orm_list_to_dicts(target_data), ignore_order=True)
            differences = []
            for key, value in diff.get("values_changed", {}).items():
                row_index = key.split("[")[1].split("]")[0]  # Extract row index from DeepDiff key
                column_name = key.split("'")[1]  # Extract column name from DeepDiff key
                if column_name in excluded_column:
                    continue
                old_value = value["old_value"]
                new_value = value["new_value"]
                difference = Differences(
                    row_index=row_index,
                    column_name=column_name,
                    old_value=str(old_value),
                    new_value=str(new_value),
                    run_id=res.id,
                    batch_id=job_id
                )
                differences.append(difference)
            self.session.add_all(differences)
            self.session.commit()
            status = "Pass" if len(differences) == 0 else "Fail"
            stmt = (
                update(CompareSession)
                .where(CompareSession.id == res.id)
                .values(result=status)
            )
            self.session.execute(stmt)
            self.session.commit()