from sqlalchemy import Table, Column, String, Integer


def create_data_table(table_name, columns, metadata):
    return Table(
        table_name,
        metadata,
        Column("id", Integer, primary_key=True, autoincrement=True),
        *[Column(col, String, nullable=True) for col in columns],
        extend_existing=True
    )