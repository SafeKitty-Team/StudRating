"""add tag table

Revision ID: 2dee809473ae
Revises: 912afd685ba2
Create Date: 2025-04-20 11:09:46.318488

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "2dee809473ae"
down_revision: Union[str, None] = "912afd685ba2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "review_tag",
        sa.Column("name", sa.String(length=50), nullable=False),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_review_tag")),
    )
    op.create_index(op.f("ix_review_tag_name"), "review_tag", ["name"], unique=True)
    op.create_table(
        "review_tag_association",
        sa.Column("review_id", sa.Integer(), nullable=False),
        sa.Column("tag_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["review_id"],
            ["review.id"],
            name=op.f("fk_review_tag_association_review_id_review"),
        ),
        sa.ForeignKeyConstraint(
            ["tag_id"],
            ["review_tag.id"],
            name=op.f("fk_review_tag_association_tag_id_review_tag"),
        ),
        sa.PrimaryKeyConstraint(
            "review_id", "tag_id", name=op.f("pk_review_tag_association")
        ),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("review_tag_association")
    op.drop_index(op.f("ix_review_tag_name"), table_name="review_tag")
    op.drop_table("review_tag")
    # ### end Alembic commands ###
