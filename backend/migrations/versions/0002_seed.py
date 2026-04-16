"""seed default user and admin

Revision ID: 0002
Revises: 0001
Create Date: 2024-01-01 00:00:01.000000

"""
import os
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from passlib.context import CryptContext

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


def upgrade() -> None:
    user_email = os.getenv("DEFAULT_USER_EMAIL", "user@example.com")
    user_password = os.getenv("DEFAULT_USER_PASSWORD", "user_pass_123")
    user_name = os.getenv("DEFAULT_USER_FULL_NAME", "Test User")

    admin_email = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@example.com")
    admin_password = os.getenv("DEFAULT_ADMIN_PASSWORD", "admin_pass_123")
    admin_name = os.getenv("DEFAULT_ADMIN_FULL_NAME", "Test Admin")

    users_table = sa.table(
        "users",
        sa.column("id", sa.Integer),
        sa.column("email", sa.String),
        sa.column("password_hash", sa.String),
        sa.column("full_name", sa.String),
    )

    admins_table = sa.table(
        "admins",
        sa.column("id", sa.Integer),
        sa.column("email", sa.String),
        sa.column("password_hash", sa.String),
        sa.column("full_name", sa.String),
    )

    accounts_table = sa.table(
        "accounts",
        sa.column("id", sa.Integer),
        sa.column("user_id", sa.Integer),
        sa.column("balance", sa.Numeric),
    )

    op.bulk_insert(
        users_table,
        [
            {
                "id": 1,
                "email": user_email,
                "password_hash": _ctx.hash(user_password),
                "full_name": user_name,
            }
        ],
    )

    op.bulk_insert(
        admins_table,
        [
            {
                "id": 1,
                "email": admin_email,
                "password_hash": _ctx.hash(admin_password),
                "full_name": admin_name,
            }
        ],
    )

    op.bulk_insert(
        accounts_table,
        [
            {
                "id": 1,
                "user_id": 1,
                "balance": 0.00,
            }
        ],
    )

    op.execute("SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 0) FROM users))")
    op.execute("SELECT setval('admins_id_seq', (SELECT COALESCE(MAX(id), 0) FROM admins))")
    op.execute("SELECT setval('accounts_id_seq', (SELECT COALESCE(MAX(id), 0) FROM accounts))")


def downgrade() -> None:
    op.execute("DELETE FROM accounts WHERE id = 1")
    op.execute("DELETE FROM admins WHERE id = 1")
    op.execute("DELETE FROM users WHERE id = 1")
