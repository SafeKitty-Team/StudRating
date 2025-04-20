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

    // Функция для создания инициалов преподавателя
    const getInitials = (name: string) => {
        return name.split(' ').map(part => part[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="professors-page">
            <div className="professors-header">
                <h1 className="page-title">Лучшие преподаватели</h1>
            </div>

            <div className="professors-search-container">
                <div className="search-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Поиск преподавателей..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="professors-search-input"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Загрузка преподавателей...</p>
                </div>
            ) : (
                <div className="professors-list">
                    {filteredProfessors.length === 0 ? (
                        <div className="no-results">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                            <h2>Преподаватели не найдены</h2>
                            <p>Попробуйте изменить параметры поиска</p>
                        </div>
                    ) : (
                        filteredProfessors.map(professor => (
                            <div key={professor.id} className="professor-card">
                                <div className="professor-avatar">
                                    {getInitials(professor.full_name)}
                                </div>

                                <div className="professor-info">
                                    <h2 className="professor-name">
                                        <Link to={`/professors/${professor.id}`}>{professor.full_name}</Link>
                                    </h2>
                                    <p className="professor-title">{professor.academic_title || 'Преподаватель'}</p>
                                    <p className="professor-department">
                                        {professor.faculty_id ? `Кафедра информатики и вычислительной техники` : 'Кафедра не указана'}
                                    </p>
                                </div>

                                <div className="professor-actions">
                                    <Link to={`/professors/${professor.id}`} className="view-profile-btn">
                                        Профиль
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14"></path>
                                            <path d="m12 5 7 7-7 7"></path>
                                        </svg>
                                    </Link>

                                    <Link to={`/review/new?entityType=professor&entityId=${professor.id}`} className="add-review-btn">
                                        Оставить отзыв
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfessorsPage;