import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Review, EntityType } from '../../models/types';
import { reviewsApi } from '../../api/reviewsApi';
import ReviewCard from './ReviewCard';
import '../../styles/reviewsList.css';

interface ReviewsListProps {
    entityType?: EntityType;
    entityId?: number;
    courseProfessorId?: number;
    onAddReview?: () => void;
    showModeration?: boolean;
}

const sortOptions = [
    { value: 'newest', label: 'Сначала новые' },
    { value: 'oldest', label: 'Сначала старые' },
    { value: 'highest', label: 'Высокий рейтинг' },
    { value: 'lowest', label: 'Низкий рейтинг' }
];

const ReviewsList: React.FC<ReviewsListProps> = ({
                                                     entityType,
                                                     entityId,
                                                     courseProfessorId,
                                                     onAddReview,
                                                     showModeration = false
                                                 }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState('newest');
    const navigate = useNavigate();

    // Загрузка отзывов в зависимости от переданных параметров
    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);
            setError(null);

            try {
                let reviewsData: Review[] = [];

                if (showModeration) {
                    // Получаем отзывы на модерации (для админов)
                    reviewsData = await reviewsApi.getReviewsOnModeration();
                } else if (courseProfessorId) {
                    // Получаем отзывы для связи преподаватель-предмет
                    reviewsData = await reviewsApi.getCourseProfessorReviews(courseProfessorId);
                } else if (entityType && entityId) {
                    // Получаем отзывы для конкретной сущности
                    reviewsData = await reviewsApi.getEntityReviews(entityType, entityId);
                } else {
                    // Получаем все отзывы, если не указаны конкретные параметры
                    reviewsData = await reviewsApi.getAllReviews();
                }

                setReviews(reviewsData);
            } catch (err) {
                console.error('Ошибка при загрузке отзывов:', err);
                setError('Не удалось загрузить отзывы. Пожалуйста, попробуйте позже.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [entityType, entityId, courseProfessorId, showModeration]);

    // Сортировка отзывов
    const getSortedReviews = () => {
        const sorted = [...reviews];

        switch (sortBy) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            case 'highest':
                return sorted.sort((a, b) => b.rating_overall - a.rating_overall);
            case 'lowest':
                return sorted.sort((a, b) => a.rating_overall - b.rating_overall);
            default:
                return sorted;
        }
    };

    // Обработчик удаления отзыва
    const handleDeleteReview = (reviewId: number) => {
        setReviews(prev => prev.filter(review => review.id !== reviewId));
    };

    // Обработчик одобрения отзыва
    const handleApproveReview = (reviewId: number) => {
        if (showModeration) {
            // Если мы в режиме модерации, удаляем одобренный отзыв из списка
            setReviews(prev => prev.filter(review => review.id !== reviewId));
        } else {
            // Иначе, обновляем статус отзыва
            setReviews(prev =>
                prev.map(review =>
                    review.id === reviewId
                        ? { ...review, is_on_moderation: false }
                        : review
                )
            );
        }
    };

    // Переход к созданию отзыва
    const handleAddReview = () => {
        if (onAddReview) {
            onAddReview();
        } else {
            // Формируем URL для создания отзыва с параметрами
            let url = '/review/new';
            if (entityType && entityId) {
                url += `?entityType=${entityType}&entityId=${entityId}`;
            } else if (courseProfessorId) {
                url += `?courseProfessorId=${courseProfessorId}`;
            }
            navigate(url);
        }
    };

    const sortedReviews = getSortedReviews();

    if (isLoading) {
        return (
            <div className="reviews-loading">
                <div className="loading-spinner"></div>
                <span>Загрузка отзывов...</span>
            </div>
        );
    }

    if (error) {
        return <div className="reviews-error">{error}</div>;
    }

    return (
        <div className="reviews-list-container">
            <div className="reviews-header">
                <h2 className="reviews-title">
                    {showModeration ? 'Отзывы на модерации' : 'Отзывы пользователей'}
                </h2>

                <div className="reviews-controls">
                    <div className="sort-control">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                            aria-label="Сортировка отзывов"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {!showModeration && (
                        <button className="add-review-button" onClick={handleAddReview}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Оставить отзыв
                        </button>
                    )}
                </div>
            </div>

            {sortedReviews.length === 0 ? (
                <div className="no-reviews">
                    {showModeration ? (
                        <p>Нет отзывов, требующих модерации.</p>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 15.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5-.7-1.5-1.5-1.5-1.5.7-1.5 1.5z"></path>
                                <path d="M7.527 17.107c1.563-1.563 4.393-1.563 5.945 0"></path>
                                <path d="M5.724 14.302c3.065-3.065 8.488-3.065 11.553 0"></path>
                                <path d="M2.343 10.586c5.657-5.657 14.657-5.657 20.314 0"></path>
                            </svg>
                            <p>Отзывов пока нет. Будьте первым, кто оставит отзыв!</p>
                            <button className="add-first-review-button" onClick={handleAddReview}>
                                Оставить первый отзыв
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="reviews-grid">
                    {sortedReviews.map(review => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            onDelete={handleDeleteReview}
                            onApprove={handleApproveReview}
                            showModeration={showModeration}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewsList;