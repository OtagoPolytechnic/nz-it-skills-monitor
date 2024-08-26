"""rename desc to description

Revision ID: 636bf0225ed2
Revises: 285c4be26556
Create Date: 2024-08-22 14:18:02.446961

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '636bf0225ed2'
down_revision = '285c4be26556'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('jobs', schema=None) as batch_op:
        batch_op.add_column(sa.Column('description', sa.Text(), nullable=True))
        batch_op.drop_column('desc')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('jobs', schema=None) as batch_op:
        batch_op.add_column(sa.Column('desc', sa.TEXT(), autoincrement=False, nullable=True))
        batch_op.drop_column('description')

    # ### end Alembic commands ###
