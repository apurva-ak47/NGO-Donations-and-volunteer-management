from sqlalchemy import inspect, text

from db.database import engine


def _get_columns(table_name: str):
    return {column["name"] for column in inspect(engine).get_columns(table_name)}


def _get_indexes(table_name: str):
    return {index["name"] for index in inspect(engine).get_indexes(table_name)}


def ensure_runtime_schema():
    with engine.begin() as connection:
        donor_columns = _get_columns("donors")
        if "user_id" not in donor_columns:
            connection.execute(text("ALTER TABLE donors ADD COLUMN user_id INT NULL"))

        donation_columns = _get_columns("donations")
        if "usage_location" not in donation_columns:
            connection.execute(text("ALTER TABLE donations ADD COLUMN usage_location VARCHAR(200) NULL"))
        if "usage_description" not in donation_columns:
            connection.execute(text("ALTER TABLE donations ADD COLUMN usage_description VARCHAR(500) NULL"))

        usage_columns = _get_columns("donation_usage")
        if "location" not in usage_columns:
            connection.execute(text("ALTER TABLE donation_usage ADD COLUMN location VARCHAR(200) NULL"))
        if "description" not in usage_columns:
            connection.execute(text("ALTER TABLE donation_usage ADD COLUMN description VARCHAR(500) NULL"))

        connection.execute(
            text(
                """
                UPDATE donors d
                JOIN users u ON u.email = d.email
                SET d.user_id = u.id
                WHERE d.user_id IS NULL
                """
            )
        )

        donor_indexes = _get_indexes("donors")
        if "ix_donors_user_id" not in donor_indexes:
            connection.execute(text("CREATE INDEX ix_donors_user_id ON donors (user_id)"))
        if "uq_donors_user_id" not in donor_indexes:
            connection.execute(text("CREATE UNIQUE INDEX uq_donors_user_id ON donors (user_id)"))
