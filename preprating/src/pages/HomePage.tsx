import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { subjectsApi } from '../api/subjectsApi';
import { professorsApi } from '../api/professorsApi';
import { facultiesApi } from '../api/facultiesApi';
import { Subject, Professor, Faculty } from '../models/types';
import '../styles/homePage.css';

const HomePage: React.FC = () => {
    const [topSubjects, setTopSubjects] = useState<Subject[]>([]);
    const [topProfessors, setTopProfessors] = useState<Professor[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Параллельная загрузка данных для повышения производительности
                const [subjectsData, professorsData, facultiesData] = await Promise.all([
                    subjectsApi.getAllSubjects(0, 6),
                    professorsApi.getAllProfessors(0, 4),
                    facultiesApi.getAllFaculties()
                ]);

                setTopSubjects(subjectsData);
                setTopProfessors(professorsData);
                setFaculties(facultiesData);
            } catch (error) {
                console.error('Ошибка при загрузке данных для главной страницы:', error);
                setError('Не удалось загрузить данные. Пожалуйста, обновите страницу или попробуйте позже.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Пустые заглушки для демонстрации во время загрузки
    const renderSkeletonSubjects = () => {
        return Array(6).fill(0).map((_, index) => (
            <div key={`subject-skeleton-${index}`} className="course-card skeleton">
                <div className="skeleton-title"></div>
                <div className="skeleton-department"></div>
                <div className="skeleton-description"></div>
                <div className="skeleton-tags">
                    <div className="skeleton-tag"></div>
                    <div className="skeleton-tag"></div>
                    <div className="skeleton-tag"></div>
                </div>
            </div>
        ));
    };

    // Заглушки для преподавателей
    const renderSkeletonProfessors = () => {
        return Array(4).fill(0).map((_, index) => (
            <div key={`professor-skeleton-${index}`} className="professor-card skeleton">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-info">
                    <div className="skeleton-name"></div>
                    <div className="skeleton-title"></div>
                    <div className="skeleton-department"></div>
                </div>
            </div>
        ));
    };

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Выбирайте образование <span className="highlight">осознанно</span></h1>
                    <p className="hero-description">
                        ПрепРейтинг — сервис отзывов о преподавателях и предметах, который помогает студентам
                        делать обоснованный выбор при планировании своего образования.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/subjects" className="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                            Найти предмет
                        </Link>
                        <Link to="/review/new" className="btn btn-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Оставить отзыв
                        </Link>
                    </div>
                </div>

                <div className="stats-container">
                    <div className="stat-item">
                        <div className="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                        </div>
                        <span className="stat-value">{isLoading ? '...' : topSubjects.length > 0 ? `${topSubjects.length * 10}+` : '500+'}</span>
                        <span className="stat-label">Предметов</span>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </div>
                        <span className="stat-value">10,000+</span>
                        <span className="stat-label">Отзывов</span>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <span className="stat-value">{isLoading ? '...' : topProfessors.length > 0 ? `${topProfessors.length * 20}+` : '300+'}</span>
                        <span className="stat-label">Преподавателей</span>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                            </svg>
                        </div>
                        <span className="stat-value">{isLoading ? '...' : faculties.length > 0 ? faculties.length : '15'}</span>
                        <span className="stat-label">Факультетов</span>
                    </div>
                </div>
            </section>

            {error && <div className="error-message">{error}</div>}

            <section className="top-courses-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="section-icon">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                        Популярные предметы
                    </h2>
                    <Link to="/subjects" className="see-all-link">Все предметы →</Link>
                </div>

                <div className="courses-grid">
                    {isLoading
                        ? renderSkeletonSubjects()
                        : topSubjects.map(subject => (
                            <div key={subject.id} className="course-card">
                                <h3 className="course-title">
                                    <Link to={`/subjects/${subject.id}`}>{subject.name}</Link>
                                </h3>
                                <p className="course-department">
                                    Программа: {subject.program_id}
                                </p>
                                <p className="course-description">
                                    {subject.description || 'Подробная информация о предмете будет доступна на странице предмета.'}
                                </p>
                                <div className="course-tags">
                                    <span className="tag">основной</span>
                                    <span className="tag">востребованный</span>
                                </div>
                                <div className="course-rating">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                    <span className="rating-value">4.6</span>
                                </div>
                                <Link to={`/subjects/${subject.id}`} className="course-link">
                                    Подробнее →
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </section>

            <section className="top-professors-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="section-icon">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Лучшие преподаватели
                    </h2>
                    <Link to="/professors" className="see-all-link">Все преподаватели →</Link>
                </div>

                <div className="professors-grid">
                    {isLoading
                        ? renderSkeletonProfessors()
                        : topProfessors.map(professor => (
                            <div key={professor.id} className="professor-card">
                                <div className="professor-avatar">
                                    {professor.full_name.split(' ').map(part => part[0]).join('').substring(0, 2)}
                                </div>
                                <div className="professor-info">
                                    <h3 className="professor-name">
                                        <Link to={`/professors/${professor.id}`}>{professor.full_name}</Link>
                                    </h3>
                                    <p className="professor-title">{professor.academic_title || 'Преподаватель'}</p>
                                    <p className="professor-faculty">Факультет #{professor.faculty_id}</p>
                                    <div className="professor-rating">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                        </svg>
                                        <span className="rating-value">4.8</span>
                                    </div>
                                    <Link to={`/professors/${professor.id}`} className="professor-link">
                                        Профиль →
                                    </Link>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>

            <section className="features-section">
                <h2 className="section-title">Почему ПрепРейтинг?</h2>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                                <line x1="6" y1="1" x2="6" y2="4"></line>
                                <line x1="10" y1="1" x2="10" y2="4"></line>
                                <line x1="14" y1="1" x2="14" y2="4"></line>
                            </svg>
                        </div>
                        <h3 className="feature-title">Анонимные отзывы</h3>
                        <p className="feature-description">
                            Делитесь честным мнением без опасений. Все отзывы публикуются анонимно,
                            что гарантирует объективность оценок.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                            </svg>
                        </div>
                        <h3 className="feature-title">Реальные оценки</h3>
                        <p className="feature-description">
                            Рейтинги основаны на отзывах студентов, которые прошли курс или учились
                            у преподавателя. Никаких рекламных или заказных отзывов.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 16v-4"></path>
                                <path d="M12 8h.01"></path>
                            </svg>
                        </div>
                        <h3 className="feature-title">Подробная информация</h3>
                        <p className="feature-description">
                            Оценки по различным критериям - от сложности до полезности,
                            помогут сделать правильный выбор при планировании обучения.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                            </svg>
                        </div>
                        <h3 className="feature-title">Без лишнего</h3>
                        <p className="feature-description">
                            Минималистичный дизайн и продуманный интерфейс помогут быстро найти
                            нужную информацию без отвлечений.
                        </p>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="cta-content">
                    <h2>Готовы поделиться своим опытом?</h2>
                    <p>Ваш отзыв поможет другим студентам сделать правильный выбор.</p>
                    <Link to="/review/new" className="btn btn-primary btn-lg">
                        Оставить отзыв
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;