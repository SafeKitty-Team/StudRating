import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { professorsApi } from '../api/professorsApi';
// Удаляем неиспользуемый импорт coursesApi
import { Professor, Review, Subject } from '../models/types';
import '../styles/professorDetail.css';

const ProfessorDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const professorId = parseInt(id || '0');

    const [professor, setProfessor] = useState<Professor | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [courses, setCourses] = useState<Subject[]>([]);
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
                // Здесь должен быть запрос для получения курсов, которые ведёт преподаватель
                // Но в API нет соответствующего метода, поэтому пока оставляем пустой массив
                setCourses([]);
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

    if (isLoading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (!professor) {
        return <div className="error">Преподаватель не найден</div>;
    }

    const professorRatings = {
        понятность: 4.5,
        компетентность: 4.9,
        доступность: 4.3,
        объективность: 4.2
    };

    return (
        <div className="professor-detail-page">
            <div className="professor-header">
                <div className="professor-profile">
                    <div className="professor-avatar">
                        {/* Инициалы преподавателя вместо аватара */}
                        {professor.full_name.split(' ').map(name => name[0]).join('')}
                    </div>

                    <div className="professor-info">
                        <h1 className="professor-name">{professor.full_name}</h1>
                        <p className="professor-title">{professor.academic_title || 'Преподаватель'}</p>
                        <p className="professor-department">
                            Кафедра [название кафедры], Факультет [название факультета]
                        </p>

                        <div className="professor-tags">
                            <span className="tag">понятные объяснения</span>
                            <span className="tag">справедливые оценки</span>
                            <span className="tag">интересные задания</span>
                            <span className="tag">практический опыт</span>
                        </div>
                    </div>

                    <div className="professor-rating">
                        <div className="overall-rating">
                            <span className="rating-icon">★</span>
                            <span className="rating-value">4.6</span>
                        </div>
                        <div className="reviews-count">{reviews.length} отзывов</div>
                    </div>
                </div>

                <div className="professor-metrics">
                    {Object.entries(professorRatings).map(([metric, value]) => (
                        <div key={metric} className="metric-item">
                            <div className="metric-value">{value}</div>
                            <div className="metric-name">{metric}</div>
                        </div>
                    ))}
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
                    Курсы (5)
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
                        <p>{professor.bio || 'Биография не указана.'}</p>

                        <h2>Научные интересы</h2>
                        <div className="scientific-interests">
                            <span className="interest-tag">Базы данных</span>
                            <span className="interest-tag">Машинное обучение</span>
                        </div>
                    </div>
                )}

                {activeTab === 'courses' && (
                    <div className="professor-courses">
                        <h2>Курсы преподавателя</h2>
                        {courses.length === 0 ? (
                            <p className="no-courses">У преподавателя пока нет курсов</p>
                        ) : (
                            <div className="courses-list">
                                {courses.map(course => (
                                    <div key={course.id} className="course-item">
                                        <h3 className="course-name">
                                            <Link to={`/courses/${course.id}`}>{course.name}</Link>
                                        </h3>
                                        <p className="course-department">Кафедра [название кафедры] • Семестр 3</p>
                                        <div className="course-tags">
                                            <span className="tag">практический</span>
                                            <span className="tag">востребованный</span>
                                            <span className="tag">много кода</span>
                                        </div>
                                        <div className="course-stats">
                                            <span className="course-year">2024-2025</span>
                                            <span className="course-reviews-count">42 отзывов</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="professor-reviews">
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

                                        <h3 className="review-title">Отличный преподаватель</h3>

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
                                            {review.text_review}
                                        </div>

                                        <div className="review-tags">
                                            <span className="tag">практический</span>
                                            <span className="tag">полезный проект</span>
                                        </div>

                                        <div className="review-footer">
                                            <div className="review-votes">
                                                <button className="vote-button">👍 Полезно (28)</button>
                                                <button className="vote-button">👎 Неполезно (2)</button>
                                            </div>
                                            <div className="review-author">
                                                Студент Бакалавриат ИВТ
                                            </div>
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