from typing import List, Optional, Dict, Any
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from core.models.reviews import Review


async def create_review(
        db: AsyncSession,
        review_data: Dict[str, Any],
        user_id: Optional[int] = None,
) -> Review:
    """
    Создает новый отзыв в базе данных

    Args:
        db: Асинхронная сессия базы данных
        review_data: Данные отзыва
        user_id: ID пользователя (опционально для анонимных отзывов)

    Returns:
        Созданный объект отзыва
    """
    review = Review(**review_data, user_id=user_id)
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review


async def get_review(db: AsyncSession, review_id: int) -> Optional[Review]:
    """
    Получает отзыв по ID

    Args:
        db: Асинхронная сессия базы данных
        review_id: ID отзыва

    Returns:
        Объект отзыва или None, если не найден
    """
    result = await db.execute(select(Review).where(Review.id == review_id))
    return result.scalar_one_or_none()


async def get_reviews(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
        include_moderated: bool = False
) -> List[Review]:
    """
    Получает список отзывов с пагинацией

    Args:
        db: Асинхронная сессия базы данных
        skip: Количество пропускаемых записей (для пагинации)
        limit: Максимальное количество возвращаемых записей
        include_moderated: Включать ли отзывы, находящиеся на модерации

    Returns:
        Список объектов отзывов
    """
    query = select(Review)

    if not include_moderated:
        query = query.where(Review.is_on_moderation == False)

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return list(result.scalars().all())


async def update_review(
        db: AsyncSession,
        review_id: int,
        review_data: Dict[str, Any]
) -> Optional[Review]:
    """
    Обновляет существующий отзыв

    Args:
        db: Асинхронная сессия базы данных
        review_id: ID отзыва
        review_data: Новые данные отзыва

    Returns:
        Обновленный объект отзыва или None, если не найден
    """
    await db.execute(
        update(Review)
        .where(Review.id == review_id)
        .values(**review_data)
    )
    await db.commit()
    return await get_review(db, review_id)


async def delete_review(db: AsyncSession, review_id: int) -> bool:
    """
    Удаляет отзыв по ID

    Args:
        db: Асинхронная сессия базы данных
        review_id: ID отзыва

    Returns:
        True если отзыв был удален, иначе False
    """
    result = await db.execute(
        delete(Review).where(Review.id == review_id)
    )
    await db.commit()
    return result.rowcount > 0


async def get_reviews_by_course_professor(
        db: AsyncSession,
        course_professor_id: int,
        include_moderated: bool = False
) -> List[Review]:
    """
    Получает все отзывы для конкретной комбинации курс-преподаватель

    Args:
        db: Асинхронная сессия базы данных
        course_professor_id: ID связи курс-преподаватель
        include_moderated: Включать ли отзывы, находящиеся на модерации

    Returns:
        Список объектов отзывов
    """
    query = select(Review).where(Review.course_professor_id == course_professor_id)

    if not include_moderated:
        query = query.where(Review.is_on_moderation == False)

    result = await db.execute(query)
    return list(result.scalars().all())


async def get_reviews_on_moderation(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100
) -> List[Review]:
    """
    Получает отзывы, ожидающие модерации

    Args:
        db: Асинхронная сессия базы данных
        skip: Количество пропускаемых записей (для пагинации)
        limit: Максимальное количество возвращаемых записей

    Returns:
        Список объектов отзывов
    """
    query = select(Review).where(Review.is_on_moderation == True).offset(skip).limit(limit)
    result = await db.execute(query)
    return list(result.scalars().all())


async def approve_review(db: AsyncSession, review_id: int) -> Optional[Review]:
    """
    Одобряет отзыв после модерации

    Args:
        db: Асинхронная сессия базы данных
        review_id: ID отзыва

    Returns:
        Обновленный объект отзыва или None, если не найден
    """
    await db.execute(
        update(Review)
        .where(Review.id == review_id)
        .values(is_on_moderation=False)
    )
    await db.commit()
    return await get_review(db, review_id)