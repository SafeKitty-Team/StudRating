import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { facultiesApi } from '../api/facultiesApi';
import { reviewsApi } from '../api/reviewsApi';
import { Faculty, AverageRatings, EntityType } from '../models/types';
import '../styles/facultiesPage.css';

const FacultiesPage: React.FC = () => {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [ratings, setRatings] = useState<Record<number, AverageRatings>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await facultiesApi.getAllFaculties();
                setFaculties(data);
                // fetch review stats for each faculty
                const statsEntries = await Promise.all(
                    data.map(async fac => {
                        const stat = await reviewsApi.getEntityRatings('faculty' as EntityType, fac.id);
                        return [fac.id, stat] as [number, AverageRatings];
                    })
                );
                setRatings(Object.fromEntries(statsEntries));
            } catch (err) {
                console.error(err);
                setError('Не удалось загрузить данные. Попробуйте позже.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return <div className="loading">Загрузка...</div>;

    if (error) return (
        <div className="error-container">
            <div className="error-message">{error}</div>
            <button className="retry-button" onClick={() => window.location.reload()}>
                Попробовать снова
            </button>
        </div>
    );

    return (
        <div className="faculties-page">
            <h1 className="page-title">Факультеты</h1>
            {faculties.length === 0 ? (
                <div className="no-faculties">Факультеты не найдены</div>
            ) : (
                <div className="faculties-list">
                    {faculties.map(faculty => (
                        <div key={faculty.id} className="faculty-card">
                            <h2 className="faculty-name">{faculty.name}</h2>
                            <p className="faculty-description">
                                {faculty.description ?? 'Описание отсутствует'}
                            </p>
                            <div className="faculty-actions">
                                <div className="faculty-rating-block">
                  <span className="rating-value">
                    {ratings[faculty.id]?.average_total.toFixed(1) ?? '—'}
                  </span>
                                    <span className="rating-icon">★</span>
                                    <span className="reviews-count">
                    {ratings[faculty.id]?.reviews_count ?? 0} отзывов
                  </span>
                                </div>
                                <Link
                                    to={`/review/new?entityType=faculty&entityId=${faculty.id}`}
                                    className="add-review-btn"
                                >
                                    Оставить отзыв
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FacultiesPage;
