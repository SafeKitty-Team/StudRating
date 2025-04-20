import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subjectsApi } from '../api/subjectsApi';
import { Subject } from '../models/types';
import '../styles/subjectsPage.css';

const SubjectsPage: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setIsLoading(true);
                const data = await subjectsApi.getAllSubjects();
                setSubjects(data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    const filteredSubjects = subjects.filter(
        subject => subject.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="subjects-page">
            <h1 className="page-title">Курсы</h1>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Поиск курсов..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>

            {isLoading ? (
                <div className="loading">Загрузка...</div>
            ) : (
                <div className="subjects-grid">
                    {filteredSubjects.map(subject => (
                        <div key={subject.id} className="subject-card">
                            <h2 className="subject-title">
                                <Link to={`/subjects/${subject.id}`}>{subject.name}</Link>
                            </h2>
                            <p className="subject-department">Кафедра информационных систем</p>
                            <p className="subject-description">{subject.description || 'Описание отсутствует'}</p>
                            <div className="subject-tags">
                                <span className="tag">практический</span>
                                <span className="tag">востребованный</span>
                                <span className="tag">много кода</span>
                            </div>
                            <div className="subject-rating">
                                <span className="rating-icon">★</span>
                                <span className="rating-value">4.6</span>
                            </div>
                            <Link to={`/subjects/${subject.id}`} className="subject-link">
                                Подробнее →
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubjectsPage;