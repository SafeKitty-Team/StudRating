"""add review table

Revision ID: 236b3f5e96fa
Revises: b04f02df89e5
Create Date: 2025-04-19 14:44:14.315586

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "236b3f5e96fa"
down_revision: Union[str, None] = "b04f02df89e5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "review",
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("course_professor_id", sa.Integer(), nullable=False),
        sa.Column("rating_overall", sa.Integer(), nullable=False),
        sa.Column("rating_difficulty", sa.Integer(), nullable=False),
        sa.Column("rating_usefulness", sa.Integer(), nullable=False),
        sa.Column("text_review", sa.Text(), nullable=False),
        sa.Column("is_on_moderation", sa.Boolean(), nullable=False),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["user_id"], ["user.id"], name=op.f("fk_review_user_id_user")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_review")),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("review")
    # ### end Alembic commands ###
