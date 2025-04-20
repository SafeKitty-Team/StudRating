from typing import List, Optional, Dict, Any
from sqlalchemy import select, update, delete, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from core.models.reviews import Review, ReviewEntityType, ReviewTag


async def create_review(
    db: AsyncSession,
    review_data: Dict[str, Any],
    user_id: Optional[int] = None,
) -> Review:
    """Создает новый отзыв в базе данных с обработкой тегов"""
    tags = review_data.pop("tags", [])

    if review_data.get("course_professor_id") in [0, None]:
        review_data.pop("course_professor_id", None)

    review = Review(**review_data, user_id=user_id)

    # Обработка тегов
    if tags:
        tag_objs = []
        for tag in tags:
            tag = tag.strip().lower()
            existing_tag = await db.execute(
                select(ReviewTag).where(ReviewTag.name == tag)
            )
            existing_tag = existing_tag.scalar_one_or_none()
            if existing_tag:
                tag_objs.append(existing_tag)
            else:
                new_tag = ReviewTag(name=tag)
                db.add(new_tag)
                await db.flush()
                tag_objs.append(new_tag)

        review.tags = tag_objs
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
    db: AsyncSession, skip: int = 0, limit: int = 100, include_moderated: bool = False
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
    db: AsyncSession, review_id: int, review_data: Dict[str, Any]
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
    # Обработка поля course_professor_id
    if review_data.get("course_professor_id") == 0:
        review_data.pop("course_professor_id", None)

    await db.execute(update(Review).where(Review.id == review_id).values(**review_data))
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
    result = await db.execute(delete(Review).where(Review.id == review_id))
    await db.commit()
    return result.rowcount > 0


async def get_reviews_by_course_professor(
    db: AsyncSession, course_professor_id: int, include_moderated: bool = False
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
    db: AsyncSession, skip: int = 0, limit: int = 100
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
    query = (
        select(Review).where(Review.is_on_moderation == True).offset(skip).limit(limit)
    )
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
        update(Review).where(Review.id == review_id).values(is_on_moderation=False)
    )
    await db.commit()
    return await get_review(db, review_id)


async def get_reviews_by_entity(
    db: AsyncSession,
    entity_type: ReviewEntityType,
    entity_id: int,
    include_moderated: bool = False,
) -> List[Review]:
    """Получает все отзывы для конкретной сущности"""
    query = select(Review).where(
        (Review.entity_type == entity_type) & (Review.entity_id == entity_id)
    )

    if not include_moderated:
        query = query.where(Review.is_on_moderation == False)

    result = await db.execute(query)
    return list(result.scalars().all())


async def get_average_ratings_by_entity(
    db: AsyncSession,
    entity_type: ReviewEntityType,
    entity_id: int,
    include_moderated: bool = False,
) -> Dict[str, float | int]:
    """
    Вычисляет средние оценки по всем критериям для сущности

    Args:
        db: Асинхронная сессия базы данных
        entity_type: Тип сущности (professor, subject, program, faculty, course_professor)
        entity_id: ID сущности
        include_moderated: Включать ли отзывы, находящиеся на модерации

    Returns:
        Словарь со средними оценками и количеством отзывов
    """
    # Базовое условие для запроса
    conditions = [Review.entity_type == entity_type, Review.entity_id == entity_id]

    # Если не включаем отзывы на модерации
    if not include_moderated:
        conditions.append(Review.is_on_moderation == False)

    # Формируем запрос
    query = select(
        func.avg(Review.rating_overall).label("avg_overall"),
        func.avg(Review.rating_difficulty).label("avg_difficulty"),
        func.avg(Review.rating_usefulness).label("avg_usefulness"),
        func.count(Review.id).label("reviews_count"),
    ).where(and_(*conditions))

    # Выполняем запрос
    result = await db.execute(query)
    stats = result.first()

    # Если нет отзывов, возвращаем нули
    if not stats or stats.reviews_count == 0:
        return {
            "rating_overall": 0.0,
            "rating_difficulty": 0.0,
            "rating_usefulness": 0.0,
            "average_total": 0.0,
            "reviews_count": 0,
        }

    # Рассчитываем общий средний рейтинг
    avg_total = (stats.avg_overall + stats.avg_difficulty + stats.avg_usefulness) / 3

    return {
        "rating_overall": round(stats.avg_overall, 2),
        "rating_difficulty": round(stats.avg_difficulty, 2),
        "rating_usefulness": round(stats.avg_usefulness, 2),
        "average_total": round(avg_total, 2),
        "reviews_count": stats.reviews_count,
    }
