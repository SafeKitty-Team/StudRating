from typing import List, Optional, Dict, Any
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from core.models.reviews import Review, ReviewEntityType


async def create_review(
        db: AsyncSession,
        review_data: Dict[str, Any],
        user_id: Optional[int] = None,
) -> Review:
    """Создает новый отзыв в базе данных"""
    review = Review(**review_data, user_id=user_id)
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review


# ... существующие операции ...


async def get_reviews_by_entity(
        db: AsyncSession,
        entity_type: ReviewEntityType,
        entity_id: int,
        include_moderated: bool = False
) -> List[Review]:
    """Получает все отзывы для конкретной сущности"""
    query = select(Review).where(
        (Review.entity_type == entity_type) & (Review.entity_id == entity_id)
    )

    if not include_moderated:
        query = query.where(Review.is_on_moderation == False)

    result = await db.execute(query)
    return list(result.scalars().all())


async def get_reviews_by_course_professor(
        db: AsyncSession,
        course_professor_id: int,
        include_moderated: bool = False
) -> List[Review]:
    """Получает все отзывы для конкретной комбинации курс-преподаватель (обратная совместимость)"""
    query = select(Review).where(Review.course_professor_id == course_professor_id)

    if not include_moderated:
        query = query.where(Review.is_on_moderation == False)

    result = await db.execute(query)
    return list(result.scalars().all())