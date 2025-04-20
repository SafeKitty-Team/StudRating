import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { professorsApi } from '../api/professorsApi';
import { subjectsApi } from '../api/subjectsApi';
import { Professor, Subject } from '../models/types';
import '../styles/searchResultsPage.css';

interface SearchResult {
    id: number;
    name: string;
    description?: string;
    type: 'professor' | 'subject';
    entity: Professor | Subject;
}

const SearchResultsPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q') || '';

    const [isLoading, setIsLoading] = useState(true);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'professors' | 'subjects'>('all');

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchQuery) {
                setResults([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // Получаем данные из обоих API
                const [professors, subjects] = await Promise.all([
                    professorsApi.getAllProfessors(),
                    subjectsApi.getAllSubjects()
                ]);

                // Фильтруем преподавателей по запросу
                const filteredProfessors: SearchResult[] = professors
                    .filter(prof =>
                        prof.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (prof.academic_title && prof.academic_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (prof.bio && prof.bio.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map(prof => ({
                        id: prof.id,
                        name: prof.full_name,
                        description: prof.academic_title || prof.bio || 'Преподаватель',
                        type: 'professor' as const,
                        entity: prof
                    }));

                // Фильтруем предметы по запросу
                const filteredSubjects: SearchResult[] = subjects
                    .filter(subj =>
                        subj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (subj.description && subj.description.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map(subj => ({
                        id: subj.id,
                        name: subj.name,
                        description: subj.description || 'Предмет',
                        type: 'subject' as const,
                        entity: subj
                    }));

                // Объединяем результаты
                setResults([...filteredProfessors, ...filteredSubjects]);
            } catch (err) {
                console.error('Ошибка при выполнении поиска:', err);
                setError('Произошла ошибка при поиске. Пожалуйста, попробуйте позже.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    // Фильтруем результаты по активному фильтру
    const filteredResults = activeFilter === 'all'
        ? results
        : results.filter(result => {
            if (activeFilter === 'professors') return result.type === 'professor';
            if (activeFilter === 'subjects') return result.type === 'subject';
            return false;
        });

    return (
        <div className="search-results-page">
            <h1 className="page-title">
                {searchQuery
                    ? `Результаты поиска: "${searchQuery}"`
                    : 'Поиск'}
            </h1>

            {searchQuery && (
                <div className="search-filters">
                    <button
                        className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        Все ({results.length})
                    </button>
                    <button
                        className={`filter-btn ${activeFilter === 'professors' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('professors')}
                    >
                        Преподаватели ({results.filter(r => r.type === 'professor').length})
                    </button>
                    <button
                        className={`filter-btn ${activeFilter === 'subjects' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('subjects')}
                    >
                        Предметы ({results.filter(r => r.type === 'subject').length})
                    </button>
                </div>
            )}

            {isLoading ? (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Выполняем поиск...</p>
                </div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : !searchQuery ? (
                <div className="empty-search">
                    <div className="empty-search-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                    <h2>Начните поиск</h2>
                    <p>Введите запрос в поисковую строку выше, чтобы найти преподавателей или предметы</p>
                </div>
            ) : filteredResults.length === 0 ? (
                <div className="no-results">
                    <div className="no-results-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                    </div>
                    <h2>Ничего не найдено</h2>
                    <p>По вашему запросу "{searchQuery}" ничего не найдено. Попробуйте изменить или упростить поисковый запрос.</p>
                </div>
            ) : (
                <div className="search-results-list">
                    {filteredResults.map(result => (
                        <div key={`${result.type}-${result.id}`} className={`search-result-item ${result.type}`}>
                            <div className="result-icon">
                                {result.type === 'professor' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                    </svg>
                                )}
                            </div>
                            <div className="result-content">
                                <h3 className="result-title">
                                    <Link to={`/${result.type}s/${result.id}`}>
                                        {result.name}
                                    </Link>
                                </h3>
                                <p className="result-type">
                                    {result.type === 'professor' ? 'Преподаватель' : 'Предмет'}
                                </p>
                                <p className="result-description">{result.description}</p>
                            </div>
                            <Link to={`/${result.type}s/${result.id}`} className="result-link">
                                Подробнее →
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResultsPage;