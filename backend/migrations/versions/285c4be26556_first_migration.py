"""First Migration

Revision ID: 285c4be26556
Revises: 
Create Date: 2024-08-19 13:34:41.416314

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '285c4be26556'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('jobs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=True),
    sa.Column('desc', sa.Text(), nullable=True),
    sa.Column('salary', sa.Integer(), nullable=True),
    sa.Column('location', sa.String(length=255), nullable=True),
    sa.Column('type', sa.String(length=50), nullable=True),
    sa.Column('duration', sa.String(length=50), nullable=True),
    sa.Column('company', sa.String(length=255), nullable=True),
    sa.Column('date_list', sa.Date(), nullable=True),
    sa.Column('date_end', sa.Date(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('skills',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('job_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['job_id'], ['jobs.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('skills')
    op.drop_table('jobs')
    # ### end Alembic commands ###