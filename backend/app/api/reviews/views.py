from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.auth.dependencies import get_current_admin_user
from api.auth.utils import get_current_user
from core.models.db_helper import db_helper
from core.models.users import User
from .crud import (
    create_review,
    get_review,
    get_reviews,
    delete_review,
    get_reviews_by_course_professor,
    get_reviews_on_moderation,
    approve_review, get_reviews_by_entity
)
from .schemas import ReviewCreate, ReviewRead
from .utils import contains_bad_words

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("/", response_model=ReviewRead, status_code=status.HTTP_201_CREATED)
async def create_new_review(
        review_data: ReviewCreate,
        db: AsyncSession = Depends(db_helper.session_getter),
        current_user: User = Depends(get_current_user),
):
    """Создание нового отзыва с проверкой на запрещенные слова"""
    # Конвертируем в словарь
    review_dict = review_data.model_dump()

    # Проверяем наличие запрещенных слов
    needs_moderation = contains_bad_words(review_dict["text_review"])
    review_dict["is_on_moderation"] = needs_moderation

    # Создаем отзыв, привязав его к текущему пользователю
    review = await create_review(db, review_dict, user_id=current_user.id)
    return review


@router.post("/anonymous/", response_model=ReviewRead, status_code=status.HTTP_201_CREATED)
async def create_anonymous_review(
        review_data: ReviewCreate,
        db: AsyncSession = Depends(db_helper.session_getter),
):
    """Создание анонимного отзыва с проверкой на запрещенные слова"""
    # Конвертируем в словарь
    review_dict = review_data.model_dump()

    # Проверяем наличие запрещенных слов
    needs_moderation = contains_bad_words(review_dict["text_review"])
    review_dict["is_on_moderation"] = needs_moderation

    # Создаем отзыв без привязки к пользователю
    review = await create_review(db, review_dict)
    return review


@router.get("/", response_model=List[ReviewRead])
async def read_reviews(
        skip: int = 0,
        limit: int = 100,
        db: AsyncSession = Depends(db_helper.session_getter),
):
    """Получение всех опубликованных отзывов"""
    reviews = await get_reviews(db, skip=skip, limit=limit, include_moderated=False)
    return reviews


@router.get("/{review_id}", response_model=ReviewRead)
async def read_review(
        review_id: int,
        db: AsyncSession = Depends(db_helper.session_getter),
):
    """Получение конкретного отзыва по ID"""
    review = await get_review(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Отзыв не найден")

    # Не показываем отзывы на модерации
    if review.is_on_moderation:
        raise HTTPException(status_code=403, detail="Отзыв находится на модерации")

    return review


@router.get("/course-professor/{course_professor_id}", response_model=List[ReviewRead])
async def read_reviews_by_course_professor(
        course_professor_id: int,
        db: AsyncSession = Depends(db_helper.session_getter),
):
    """Получение всех отзывов для конкретной комбинации курс-преподаватель (для обратной совместимости)"""
    reviews = await get_reviews_by_course_professor(db, course_professor_id)
    return reviews


# Административные маршруты (требуют прав администратора)
@router.get("/admin/moderation", response_model=List[ReviewRead])
async def read_reviews_on_moderation(
        skip: int = 0,
        limit: int = 100,
        db: AsyncSession = Depends(db_helper.session_getter),
        admin_user: User = Depends(get_current_admin_user),
):
    """Получение отзывов, ожидающих модерации (только для администраторов)"""
    reviews = await get_reviews_on_moderation(db, skip=skip, limit=limit)
    return reviews


@router.post("/admin/approve/{review_id}", response_model=ReviewRead)
async def approve_review_after_moderation(
        review_id: int,
        db: AsyncSession = Depends(db_helper.session_getter),
        admin_user: User = Depends(get_current_admin_user),
):
    """Одобрение отзыва после модерации (только для администраторов)"""
    review = await approve_review(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Отзыв не найден")
    return review


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_review(
        review_id: int,
        db: AsyncSession = Depends(db_helper.session_getter),
        admin_user: User = Depends(get_current_admin_user),
):
    """Удаление отзыва (только для администраторов)"""
    success = await delete_review(db, review_id)
    if not success:
        raise HTTPException(status_code=404, detail="Отзыв не найден")



@router.get("/entity/{entity_type}/{entity_id}", response_model=List[ReviewRead])
async def read_reviews_by_entity(
        entity_type: SchemaReviewEntityType,
        entity_id: int,
        db: AsyncSession = Depends(db_helper.session_getter),
):
    """Получение всех отзывов для конкретной сущности"""
    reviews = await get_reviews_by_entity(db, entity_type, entity_id)
    return reviews
