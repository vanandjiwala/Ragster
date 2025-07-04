"""modify user model for RBAC models

Revision ID: a155d1e82f7c
Revises: 9bbc73e26175
Create Date: 2025-06-06 14:10:16.314482

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a155d1e82f7c'
down_revision: Union[str, None] = '9bbc73e26175'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('hashed_password', sa.String(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'hashed_password')
    # ### end Alembic commands ###
