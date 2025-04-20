import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { subjectsApi } from '../api/subjectsApi'; // Обновлено с coursesApi на subjectsApi
import { Subject } from '../models/types';
import '../styles/homePage.css';

const HomePage: React.FC = () => {
    const [topSubjects, setTopSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTopSubjects = async () => {
            try {
                const subjects = await subjectsApi.getAllSubjects(0, 5); // Получаем первые 5 предметов
                setTopSubjects(subjects);
            } catch (error) {
                console.error('Error fetching top subjects:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopSubjects();
    }, []);

    return (
        <div className="home-page">
            <section className="hero-section">
                <h1 className="hero-title">Выбирайте курсы осознанно</h1>
                <p className="hero-description">
                    ПрепРейтинг помогает студентам принимать обоснованные решения при
                    выборе курсов и преподавателей на основе отзывов других студентов.
                </p>
                <div className="hero-buttons">
                    <Link to="/subjects" className="btn btn-primary">Найти курс</Link>
                    <Link to="/review/new" className="btn btn-secondary">Оставить отзыв</Link>
                </div>

                <div className="stats-container">
                    <div className="stat-item">
                        <span className="stat-icon">📚</span>
                        <span className="stat-value">500+</span>
                        <span className="stat-label">Курсов</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-icon">⭐</span>
                        <span className="stat-value">10,000+</span>
                        <span className="stat-label">Отзывов</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-icon">👨‍🏫</span>
                        <span className="stat-value">300+</span>
                        <span className="stat-label">Преподавателей</span>
                    </div>
                </div>
            </section>

            <section className="top-courses-section">
                <div className="section-header">
                    <h2 className="section-title">Топ курсов</h2>
                    <Link to="/subjects" className="see-all-link">Все курсы →</Link>
                </div>

                {isLoading ? (
                    <div className="loading">Загрузка...</div>
                ) : (
                    <div className="courses-grid">
                        {topSubjects.map(subject => (
                            <div key={subject.id} className="course-card">
                                <h3 className="course-title">{subject.name}</h3>
                                <p className="course-department">
                                    Кафедра информационных систем
                                </p>
                                <p className="course-description">
                                    {subject.description || 'Описание отсутствует'}
                                </p>
                                <div className="course-tags">
                                    <span className="tag">сложный</span>
                                    <span className="tag">полезный</span>
                                    <span className="tag">теоретический</span>
                                </div>
                                <Link to={`/subjects/${subject.id}`} className="course-link">
                                    Подробнее →
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;