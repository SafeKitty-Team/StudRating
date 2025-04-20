import React, { useState } from 'react';
import { Review } from '../../models/types';
import ReviewCard from './ReviewCard';
import '../../styles/reviewsList.css';

interface ReviewsListProps {
    reviews: Review[];
    onAddReview?: () => void;
}

const sortOptions = [
    { value: 'newest', label: 'Сначала новые' },
    { value: 'oldest', label: 'Сначала старые' },
    { value: 'highest', label: 'Высокий рейтинг' },
    { value: 'lowest', label: 'Низкий рейтинг' }
];

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, onAddReview }) => {
    const [sortBy, setSortBy] = useState('newest');

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

    const sortedReviews = getSortedReviews();

    return (
        <div className="reviews-list-container">
            <div className="reviews-header">
                <h2 className="reviews-title">Отзывы студентов</h2>

                <div className="reviews-controls">
                    <div className="sort-control">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {onAddReview && (
                        <button className="add-review-button" onClick={onAddReview}>
                            Оставить отзыв
                        </button>
                    )}
                </div>
            </div>

            {sortedReviews.length === 0 ? (
                <div className="no-reviews">
                    <p>Отзывов пока нет. Будьте первым, кто оставит отзыв!</p>
                    {onAddReview && (
                        <button className="add-first-review-button" onClick={onAddReview}>
                            Оставить первый отзыв
                        </button>
                    )}
                </div>
            ) : (
                <div className="reviews-grid">
                    {sortedReviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewsList;