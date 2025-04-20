import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Мы будем использовать этот импорт
import { facultiesApi } from '../api/facultiesApi';
// Удаляем неиспользуемые импорты
import { Faculty } from '../models/types';
import '../styles/facultiesPage.css';

const FacultiesPage: React.FC = () => {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                setIsLoading(true);
                const data = await facultiesApi.getAllFaculties();
                setFaculties(data);
            } catch (error) {
                console.error('Error fetching faculties:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFaculties();
    }, []);

    return (
        <div className="faculties-page">
            <h1 className="page-title">Факультеты и кафедры</h1>

            {isLoading ? (
                <div className="loading">Загрузка...</div>
            ) : (
                <div className="faculties-list">
                    {faculties.map(faculty => (
                        <div key={faculty.id} className="faculty-card">
                            <h2 className="faculty-name">{faculty.name}</h2>
                            <p className="faculty-description">{faculty.description || 'Описание отсутствует'}</p>

                            <div className="faculty-metrics">
                                <div className="metric">
                                    <span className="metric-value">15</span>
                                    <span className="metric-label">Кафедр</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-value">42</span>
                                    <span className="metric-label">Программ</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-value">4.7</span>
                                    <span className="metric-label">Рейтинг</span>
                                </div>
                            </div>

                            <h3 className="department-section-title">Кафедры</h3>
                            <div className="departments-list">
                                <div className="department-item">
                                    <h4 className="department-name">
                                        <Link to="/faculties/1/departments/1">Кафедра высшей математики</Link>
                                    </h4>
                                    <div className="department-info">
                                        <span className="department-courses-count">25 курсов</span>
                                        <span className="department-rating">★ 4.6</span>
                                    </div>
                                </div>
                                <div className="department-item">
                                    <h4 className="department-name">
                                        <Link to="/faculties/1/departments/2">Кафедра информационных систем</Link>
                                    </h4>
                                    <div className="department-info">
                                        <span className="department-courses-count">18 курсов</span>
                                        <span className="department-rating">★ 4.8</span>
                                    </div>
                                </div>
                                <div className="department-item">
                                    <h4 className="department-name">
                                        <Link to="/faculties/1/departments/3">Кафедра программирования</Link>
                                    </h4>
                                    <div className="department-info">
                                        <span className="department-courses-count">30 курсов</span>
                                        <span className="department-rating">★ 4.9</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FacultiesPage;