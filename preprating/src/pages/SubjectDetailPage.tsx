import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { subjectsApi } from '../api/subjectsApi';
import { Subject, AverageRatings, Review } from '../models/types';
import '../styles/subjectDetail.css';

const SubjectDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const subjectId = parseInt(id || '0');

    const [subject, setSubject] = useState<Subject | null>(null);
    const [ratings, setRatings] = useState<AverageRatings | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');

    useEffect(() => {
        const fetchSubjectData = async () => {
            setIsLoading(true);
            try {
                const [subjectData, subjectRatings, subjectReviews] = await Promise.all([
                    subjectsApi.getSubjectById(subjectId),
                    subjectsApi.getSubjectRatings(subjectId),
                    subjectsApi.getSubjectReviews(subjectId)
                ]);

                setSubject(subjectData);
                setRatings(subjectRatings);
                setReviews(subjectReviews);
            } catch (error) {
                console.error('Error fetching subject data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (subjectId) {
            fetchSubjectData();
        }
    }, [subjectId]);

    if (isLoading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (!subject) {
        return <div className="error">Курс не найден</div>;
    }

    return (
        <div className="subject-detail-page">
            <div className="subject-header">
                <h1 className="subject-title">{subject.name}</h1>
                <div className="subject-meta">
                    <p className="subject-department">
                        Кафедра информационных систем • Семестр 3
                    </p>
                    <p className="subject-professor">
                        Преподаватель: Петрова М.С.
                    </p>
                </div>

                <div className="subject-tags">
                    <span className="tag">практический</span>
                    <span className="tag">востребованный</span>
                    <span className="tag">много кода</span>
                </div>

                {ratings && (
                    <div className="subject-ratings">
                        <div className="rating-overall">
                            <span className="rating-icon">⭐</span>
                            <span className="rating-value">{ratings.rating_overall.toFixed(1)}</span>
                        </div>
                        <div className="rating-stats">
                            <div className="rating-item">
                                <span className="rating-label">Сложность:</span>
                                <span className="rating-value">{ratings.rating_difficulty.toFixed(1)}</span>
                            </div>
                            <div className="rating-item">
                                <span className="rating-label">Полезность:</span>
                                <span className="rating-value">{ratings.rating_usefulness.toFixed(1)}</span>
                            </div>
                            <div className="rating-item">
                                <span className="rating-label">Отзывов:</span>
                                <span className="rating-value">{ratings.reviews_count}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="subject-actions">
                <Link to={`/review/new?entityType=subject&entityId=${subjectId}`} className="action-button primary-action">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Оставить отзыв
                </Link>
            </div>

            <div className="subject-tabs">
                <button
                    className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Обзор курса
                </button>
                <button
                    className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Отзывы ({reviews.length})
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'overview' ? (
                    <div className="subject-overview">
                        <h2>Описание курса</h2>
                        <p>{subject.description || 'Описание отсутствует'}</p>

                        <h2>Предварительные требования</h2>
                        <ul>
                            <li>Алгоритмы и структуры данных</li>
                            <li>Основы программирования</li>
                        </ul>

                        <h2>Основные темы</h2>
                        <ul>
                            <li>Модели данных и проектирование баз данных</li>
                            <li>Реляционная алгебра и SQL</li>
                            <li>Нормализация и денормализация</li>
                            <li>Транзакции и управление параллелизмом</li>
                            <li>Индексы и оптимизация запросов</li>
                            <li>NoSQL базы данных</li>
                            <li>Распределенные базы данных</li>
                        </ul>
                    </div>
                ) : (
                    <div className="subject-reviews">
                        <div className="reviews-header">
                            <h2>Отзывы студентов</h2>
                            <Link to="/review/new" className="add-review-button">Оставить отзыв</Link>
                        </div>

                        {reviews.length === 0 ? (
                            <p className="no-reviews">Отзывов пока нет</p>
                        ) : (
                            <div className="reviews-list">
                                {reviews.map(review => (
                                    <div key={review.id} className="review-card">
                                        <div className="review-header">
                                            <div className="review-rating">
                                                {'★'.repeat(review.rating_overall)}
                                                {'☆'.repeat(5 - review.rating_overall)}
                                                <span className="rating-number">{review.rating_overall}</span>
                                            </div>
                                            <div className="review-date">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="review-meta">
                                            <div className="review-difficulty">
                                                <span className="review-label">Сложность:</span>
                                                <span className="review-value">{review.rating_difficulty}</span>
                                            </div>
                                            <div className="review-usefulness">
                                                <span className="review-label">Полезность:</span>
                                                <span className="review-value">{review.rating_usefulness}</span>
                                            </div>
                                        </div>

                                        <div className="review-text">
                                            {review.text_review}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubjectDetailPage;