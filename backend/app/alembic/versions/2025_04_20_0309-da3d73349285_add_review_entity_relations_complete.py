"""add review entity relations complete

Revision ID: da3d73349285
Revises: 4ec49ded4654
Create Date: 2025-04-20 03:09:34.791530

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
# Добавьте в начало файла импорт text
from sqlalchemy import text, Enum
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'da3d73349285'
down_revision: Union[str, None] = '4ec49ded4654'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Проверяем существование полей
    conn = op.get_bind()

    # Создаем ENUM тип безопасным способом
    op.execute(text("""
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_entity_type') THEN
        CREATE TYPE review_entity_type AS ENUM ('professor', 'subject', 'program', 'faculty', 'course_professor');
      END IF;
    END $$;
    """))

    # Проверяем существование таблицы course_professor
    course_professor_exists = conn.execute(text("""
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'course_professor'
    );
    """)).scalar()

    # Проверяем существование колонки entity_type
    result = conn.execute(text("""
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'review' AND column_name = 'entity_type'
    """))

    if result.rowcount == 0:
        # Добавляем колонки, если их нет
        op.add_column('review', sa.Column('entity_type',
                                          Enum('professor', 'subject', 'program', 'faculty', 'course_professor',
                                               name='review_entity_type'), nullable=True))
        op.add_column('review', sa.Column('entity_id', sa.Integer(), nullable=True))

        # Заполняем данные - теперь безопасно с проверкой
        if course_professor_exists:
            op.execute(text(
                "UPDATE review SET entity_type = 'course_professor', entity_id = course_professor_id WHERE course_professor_id IS NOT NULL"))

        # Устанавливаем значения по умолчанию для записей без данных
        op.execute(text("UPDATE review SET entity_type = 'professor', entity_id = 1 WHERE entity_type IS NULL"))

        # Делаем колонки NOT NULL
        op.execute(text("ALTER TABLE review ALTER COLUMN entity_type SET NOT NULL"))
        op.execute(text("ALTER TABLE review ALTER COLUMN entity_id SET NOT NULL"))

    # Проверяем состояние course_professor_id
    # Сначала смотрим, существует ли колонка
    column_nullable = conn.execute(text("""
    SELECT is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'review' AND column_name = 'course_professor_id'
    """)).scalar()

    if column_nullable == 'NO':  # Колонка существует и не допускает NULL
        op.execute(text("ALTER TABLE review ALTER COLUMN course_professor_id DROP NOT NULL"))

    # Добавляем внешний ключ только если таблица course_professor существует
    if course_professor_exists:
        op.execute(text("""
        DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'fk_review_course_professor_id_course_professor'
          ) THEN
            ALTER TABLE review ADD CONSTRAINT fk_review_course_professor_id_course_professor 
            FOREIGN KEY (course_professor_id) REFERENCES course_professor(id) ON DELETE SET NULL;
          END IF;
        END $$;
        """))


def downgrade() -> None:
    """Downgrade schema."""
    # Проверяем существование constraints перед удалением
    conn = op.get_bind()
    constraint_exists = conn.execute(text("""
    SELECT EXISTS (
        SELECT FROM pg_constraint 
        WHERE conname = 'fk_review_course_professor_id_course_professor'
    );
    """)).scalar()

    if constraint_exists:
        # В случае отката, удаляем внешний ключ
        op.drop_constraint('fk_review_course_professor_id_course_professor', 'review', type_='foreignkey')

    # Удаляем колонки, если они существуют
    entity_id_exists = conn.execute(text("""
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'review' AND column_name = 'entity_id'
    );
    """)).scalar()

    entity_type_exists = conn.execute(text("""
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'review' AND column_name = 'entity_type'
    );
    """)).scalar()

    if entity_id_exists:
        op.drop_column('review', 'entity_id')

    if entity_type_exists:
        op.drop_column('review', 'entity_type')

    # Удаляем ENUM тип
    op.execute(text("DROP TYPE IF EXISTS review_entity_type"))