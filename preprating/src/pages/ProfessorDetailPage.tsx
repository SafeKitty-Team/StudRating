import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { professorsApi } from '../api/professorsApi';
import { Professor, Review } from '../models/types';
import '../styles/professorDetail.css';

const ProfessorDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const professorId = parseInt(id || '0');

    const [professor, setProfessor] = useState<Professor | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'about' | 'courses' | 'reviews'>('about');

    useEffect(() => {
        const fetchProfessorData = async () => {
            setIsLoading(true);
            try {
                const professorData = await professorsApi.getProfessorById(professorId);
                const professorReviews = await professorsApi.getProfessorReviews(professorId);
                setProfessor(professorData);
                setReviews(professorReviews);
            } catch (error) {
                console.error('Error fetching professor data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (professorId) {
            fetchProfessorData();
        }
    }, [professorId]);

    // Расчет реальной средней оценки на основе отзывов
    const calculateAverageRating = (reviews: Review[]) => {
        if (reviews.length === 0) return 0;
        return parseFloat((reviews.reduce((sum, review) => sum + review.rating_overall, 0) / reviews.length).toFixed(1));
    };

    // Получаем первую букву для аватара
    const getInitial = (name: string) => {
        return name?.charAt(0) || '';
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Загрузка информации о преподавателе...</p>
            </div>
        );
    }

    if (!professor) {
        return (
            <div className="error-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h2>Преподаватель не найден</h2>
                <p>Возможно, указан неверный идентификатор</p>
                <Link to="/professors" className="back-link">Вернуться к списку преподавателей</Link>
            </div>
        );
    }

    // Рассчитываем среднюю оценку на основе реальных отзывов
    const averageRating = calculateAverageRating(reviews);

    return (
        <div className="professor-detail-page">
            <div className="professor-header">
                <div className="professor-profile">
                    <div className="professor-avatar">
                        {getInitial(professor.full_name)}
                    </div>

                    <div className="professor-info">
                        <h1 className="professor-name">{professor.full_name}</h1>
                        <p className="professor-title">{professor.academic_title || 'Преподаватель'}</p>
                        <p className="professor-department">
                            Кафедра информатики и вычислительной техники
                        </p>
                    </div>

                    <div className="professor-actions">
                        <Link to={`/review/new?entityType=professor&entityId=${professorId}`} className="review-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Оставить отзыв
                        </Link>
                    </div>
                </div>

                <div className="professor-rating-block">
                    <div className="rating-display">
                        <span className="rating-value">{averageRating.toFixed(1)}</span>
                        <span className="rating-icon">★</span>
                    </div>
                    <div className="reviews-count">{reviews.length} отзывов</div>
                </div>
            </div>

            <div className="professor-tabs">
                <button
                    className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
                    onClick={() => setActiveTab('about')}
                >
                    О преподавателе
                </button>
                <button
                    className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('courses')}
                >
                    Курсы
                </button>
                <button
                    className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Отзывы ({reviews.length})
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'about' && (
                    <div className="professor-about">
                        <h2>Биография</h2>
                        <p>{professor.bio || 'Биография преподавателя пока не указана.'}</p>
                    </div>
                )}

                {activeTab === 'courses' && (
                    <div className="professor-courses">
                        <h2>Курсы преподавателя</h2>
                        <p className="no-courses">Информация о курсах загружается из API</p>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="professor-reviews">
                        <div className="reviews-header">
                            <h2>Отзывы студентов</h2>
                            <Link to={`/review/new?entityType=professor&entityId=${professorId}`} className="add-review-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Оставить отзыв
                            </Link>
                        </div>

                        {reviews.length === 0 ? (
                            <div className="no-reviews">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <p>Отзывов пока нет</p>
                                <Link to={`/review/new?entityType=professor&entityId=${professorId}`} className="add-first-review-button">
                                    Оставить первый отзыв
                                </Link>
                            </div>
                        ) : (
                            <div className="reviews-list">
                                {reviews.map(review => (
                                    <div key={review.id} className="review-card">
                                        <div className="review-header">
                                            <div className="review-rating">
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <span key={index} className={`star ${index < review.rating_overall ? 'filled' : ''}`}>
                                                        ★
                                                    </span>
                                                ))}
                                                <span className="rating-number">{review.rating_overall}</span>
                                            </div>
                                            <div className="review-date">
                                                {new Date(review.created_at).toLocaleDateString('ru-RU')}
                                            </div>
                                        </div>

                                        <div className="review-meta">
                                            <div className="review-metric">
                                                <span className="metric-label">Сложность:</span>
                                                <span className="metric-value">{review.rating_difficulty}</span>
                                            </div>
                                            <div className="review-metric">
                                                <span className="metric-label">Полезность:</span>
                                                <span className="metric-value">{review.rating_usefulness}</span>
                                            </div>
                                        </div>

                                        <div className="review-text">
                                            {review.text_review || 'Текст отзыва не предоставлен'}
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

export default ProfessorDetailPage;