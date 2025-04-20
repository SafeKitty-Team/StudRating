# test_data.py

import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from core.config import settings
from core.models.base import Base
from core.models.faculties import Faculty
from core.models.programs import Program, DegreeLevel
from core.models.subjects import Subject
from core.models.professors import Professor, CourseProfessor
from core.models.reviews import Review, ReviewEntityType
from core.models.users import User, UserRole


async def main():
    # создаём движок и сессию
    engine = create_async_engine(settings.db.url, echo=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    AsyncSessionLocal = sessionmaker(
        bind=engine, expire_on_commit=False, class_=AsyncSession
    )

    async with AsyncSessionLocal() as session:
        # 1) Пользователи (2 обычных + 1 админ)
        user1 = User(email="user1@example.com", password="pass1", roles=UserRole.user)
        user2 = User(email="user2@example.com", password="pass2", roles=UserRole.user)
        admin = User(
            email="admin@example.com", password="adminpass", roles=UserRole.admin
        )
        session.add_all([user1, user2, admin])

        # 2) Факультеты
        fac1 = Faculty(name="Faculty of Science", description="Научный факультет")
        fac2 = Faculty(name="Faculty of Arts", description="Гуманитарный факультет")
        session.add_all([fac1, fac2])
        await session.flush()

        # 3) Программы — теперь DegreeLevel берём из Enum
        prog1 = Program(name="Physics", degree_level=DegreeLevel.bachelor, faculty=fac1)
        prog2 = Program(name="History", degree_level=DegreeLevel.bachelor, faculty=fac2)
        session.add_all([prog1, prog2])
        await session.flush()

        # 4) Предметы
        subj1 = Subject(
            name="Quantum Mechanics", description="Квантовая механика", program=prog1
        )
        subj2 = Subject(
            name="World History", description="Всемирная история", program=prog2
        )
        session.add_all([subj1, subj2])
        await session.flush()

        # 5) Преподаватели
        prof1 = Professor(
            full_name="Dr. Alice",
            academic_title="PhD",
            bio="Физик-теоретик",
            faculty=fac1,
        )
        prof2 = Professor(
            full_name="Dr. Bob", academic_title="PhD", bio="Историк", faculty=fac2
        )
        session.add_all([prof1, prof2])
        await session.flush()

        # 6) CourseProfessor (связка)
        cp1 = CourseProfessor(subject=subj1, professor=prof1)
        cp2 = CourseProfessor(subject=subj2, professor=prof2)
        session.add_all([cp1, cp2])
        await session.flush()

        # 7) Отзывы
        rev1 = Review(
            user_id=user1.id,
            entity_type=ReviewEntityType.faculty,
            entity_id=fac1.id,
            rating_overall=5,
            rating_difficulty=3,
            rating_usefulness=4,
            text_review="Отличный факультет!",
            is_on_moderation=False,
        )
        rev2 = Review(
            user_id=user2.id,
            entity_type=ReviewEntityType.course_professor,
            entity_id=cp1.id,
            course_professor_id=cp1.id,
            rating_overall=4,
            rating_difficulty=2,
            rating_usefulness=5,
            text_review="Интересный курс у профессора.",
            is_on_moderation=False,
        )
        session.add_all([rev1, rev2])

        await session.commit()

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
