import React, { useState } from 'react';
import { Review } from '../../models/types';
import '../../styles/reviewCard.css';

interface ReviewCardProps {
    review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 30)); // Случайное число для демонстрации
    const [dislikesCount, setDislikesCount] = useState(Math.floor(Math.random() * 5)); // Случайное число для демонстрации

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
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

    // Предполагаем, что текст отзыва должен быть сокращен, если он длиннее X символов
    const isLongReview = review.text_review.length > 300;
    const reviewText = isExpanded || !isLongReview
        ? review.text_review
        : `${review.text_review.substring(0, 300)}...`;

    return (
        <div className="review-card">
            <div className="review-header">
                <div className="review-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`star ${i < review.rating_overall ? 'filled' : 'empty'}`}>
              ★
            </span>
                    ))}
                    <span className="rating-value">{review.rating_overall}</span>
                </div>
                <div className="review-date">{formatDate(review.created_at)}</div>
            </div>

            <h3 className="review-title">
                {review.rating_overall >= 4
                    ? 'Отличный курс/преподаватель'
                    : review.rating_overall >= 3
                        ? 'Хороший курс/преподаватель'
                        : 'Требует улучшения'}
            </h3>

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

            <div className="review-tags">
                <span className="tag">практический</span>
                <span className="tag">сложные домашние задания</span>
                <span className="tag">полезный проект</span>
            </div>

            <div className="review-footer">
                <div className="review-actions">
                    <button
                        className={`action-btn like-btn ${liked ? 'active' : ''}`}
                        onClick={handleLike}
                    >
                        👍 Полезно ({likesCount})
                    </button>
                    <button
                        className={`action-btn dislike-btn ${disliked ? 'active' : ''}`}
                        onClick={handleDislike}
                    >
                        👎 Неполезно ({dislikesCount})
                    </button>
                </div>
                <div className="review-author">
                    Студент Бакалавриат, 2024
                </div>
            </div>

            {review.is_on_moderation && (
                <div className="moderation-badge">На модерации</div>
            )}
        </div>
    );
};

export default ReviewCard;