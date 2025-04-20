import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { professorsApi } from '../api/professorsApi';
import { Professor } from '../models/types';
import '../styles/professorsPage.css';

const ProfessorsPage: React.FC = () => {
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProfessors = async () => {
            try {
                setIsLoading(true);
                const data = await professorsApi.getAllProfessors();
                setProfessors(data);
            } catch (error) {
                console.error('Error fetching professors:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfessors();
    }, []);

    const filteredProfessors = professors.filter(
        professor => professor.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="professors-page">
            <h1 className="page-title">Лучшие преподаватели</h1>

            <div className="professors-search">
                <input
                    type="text"
                    placeholder="Поиск преподавателей..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="professors-search-input"
                />
            </div>

            {isLoading ? (
                <div className="loading">Загрузка...</div>
            ) : (
                <div className="professors-list">
                    {filteredProfessors.map(professor => (
                        <div key={professor.id} className="professor-card">
                            <div className="professor-info">
                                <h2 className="professor-name">
                                    <Link to={`/professors/${professor.id}`}>
                                        {professor.full_name}
                                    </Link>
                                </h2>
                                <p className="professor-title">{professor.academic_title || 'Преподаватель'}</p>
                                <p className="professor-department">Кафедра [название кафедры]</p>

                                <div className="professor-tags">
                                    <span className="tag">понятно объясняет</span>
                                    <span className="tag">справедливые оценки</span>
                                </div>

                                <p className="professor-courses-count">3 курсов</p>
                            </div>

                            <div className="professor-rating">
                                <div className="rating-badge">
                                    <span className="rating-icon">★</span>
                                    <span className="rating-value">4.8</span>
                                </div>
                                <Link to={`/professors/${professor.id}`} className="professor-details-link">
                                    Подробнее →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfessorsPage;