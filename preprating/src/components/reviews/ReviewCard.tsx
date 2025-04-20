import React, { useState } from 'react';
import { Review } from '../../models/types';
import { useAuth } from '../../contexts/AuthContext';
import { reviewsApi } from '../../api/reviewsApi';
import '../../styles/reviewCard.css';

interface ReviewCardProps {
    review: Review;
    onDelete?: (reviewId: number) => void;
    onApprove?: (reviewId: number) => void;
    showModeration?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
                                                   review,
                                                   onDelete,
                                                   onApprove,
                                                   showModeration = false
                                               }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [dislikesCount, setDislikesCount] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const { user } = useAuth();

    const isAdmin = user?.roles === 'admin' || user?.roles === 'superuser';

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleLike = () => {
        if (liked) {
            setLiked(false);
            setLikesCount(prev => prev - 1);
        } else {
            setLiked(true);
            setLikesCount(prev => prev + 1);
            if (disliked) {
                setDisliked(false);
                setDislikesCount(prev => prev - 1);
            }
        }
    };

    const handleDislike = () => {
        if (disliked) {
            setDisliked(false);
            setDislikesCount(prev => prev - 1);
        } else {
            setDisliked(true);
            setDislikesCount(prev => prev + 1);
            if (liked) {
                setLiked(false);
                setLikesCount(prev => prev - 1);
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
            try {
                setIsDeleting(true);
                await reviewsApi.deleteReview(review.id);
                onDelete && onDelete(review.id);
            } catch (error) {
                console.error('Ошибка при удалении отзыва:', error);
                alert('Не удалось удалить отзыв. Пожалуйста, попробуйте снова.');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleApprove = async () => {
        try {
            setIsApproving(true);
            await reviewsApi.approveReview(review.id);
            onApprove && onApprove(review.id);
        } catch (error) {
            console.error('Ошибка при одобрении отзыва:', error);
            alert('Не удалось одобрить отзыв. Пожалуйста, попробуйте снова.');
        } finally {
            setIsApproving(false);
        }
    };

    // Определяем, длинный ли отзыв, и при необходимости сокращаем его
    const isLongReview = review.text_review.length > 300;
    const reviewText = isExpanded || !isLongReview
        ? review.text_review
        : `${review.text_review.substring(0, 300)}...`;

    // Определяем, как отобразить заголовок отзыва на основе рейтинга
    const getReviewTitle = () => {
        if (review.rating_overall >= 4) {
            return 'Отличный предмет/преподаватель';
        } else if (review.rating_overall >= 3) {
            return 'Хороший предмет/преподаватель';
        } else {
            return 'Требует улучшения';
        }
    };

    return (
        <div className={`review-card ${review.is_on_moderation ? 'review-card-moderation' : ''}`}>
            <div className="review-header">
                <div className="review-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span
                            key={i}
                            className={`star ${i < review.rating_overall ? 'filled' : 'empty'}`}
                            aria-hidden="true"
                        >
              ★
            </span>
                    ))}
                    <span className="rating-value">{review.rating_overall}</span>
                </div>
                <div className="review-date">{formatDate(review.created_at)}</div>
            </div>

            <h3 className="review-title">{getReviewTitle()}</h3>

            <div className="review-metrics">
                <div className="metric">
                    <span className="metric-label">Сложность:</span>
                    <span className={`metric-value difficulty-${review.rating_difficulty}`}>
            {review.rating_difficulty}
          </span>
                </div>
                <div className="metric">
                    <span className="metric-label">Полезность:</span>
                    <span className={`metric-value usefulness-${review.rating_usefulness}`}>
            {review.rating_usefulness}
          </span>
                </div>
            </div>

            <div className="review-text">
                {reviewText}
                {isLongReview && (
                    <button
                        className="read-more-btn"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'Свернуть' : 'Читать полностью'}
                    </button>
                )}
            </div>

            <div className="review-footer">
                <div className="review-actions">
                    <button
                        className={`action-btn like-btn ${liked ? 'active' : ''}`}
                        onClick={handleLike}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                        <span>Полезно</span>
                        {likesCount > 0 && <span className="count">({likesCount})</span>}
                    </button>
                    <button
                        className={`action-btn dislike-btn ${disliked ? 'active' : ''}`}
                        onClick={handleDislike}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm10-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
                        </svg>
                        <span>Неполезно</span>
                        {dislikesCount > 0 && <span className="count">({dislikesCount})</span>}
                    </button>
                </div>

                {/* Показываем кнопки модерации только для админов и если режим модерации активен */}
                {isAdmin && showModeration && (
                    <div className="moderation-actions">
                        {review.is_on_moderation && (
                            <button
                                className="approve-btn"
                                onClick={handleApprove}
                                disabled={isApproving}
                            >
                                {isApproving ? 'Одобрение...' : 'Одобрить'}
                            </button>
                        )}
                        <button
                            className="delete-btn"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Удаление...' : 'Удалить'}
                        </button>
                    </div>
                )}
            </div>

            {review.is_on_moderation && (
                <div className="moderation-badge">На модерации</div>
            )}
        </div>
    );
};

export default ReviewCard;