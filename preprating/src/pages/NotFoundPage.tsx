import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/notFoundPage.css';

/**
 * Страница 404 Not Found
 */
const NotFoundPage: React.FC = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <div className="not-found-code">404</div>
                <h1 className="not-found-title">Страница не найдена</h1>
                <p className="not-found-message">
                    Запрашиваемая страница не существует или была перемещена.
                </p>
                <div className="not-found-actions">
                    <Link to="/" className="btn btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Вернуться на главную
                    </Link>
                    <button
                        className="btn btn-secondary"
                        onClick={() => window.history.back()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Назад
                    </button>
                </div>
            </div>

            <div className="not-found-illustration">
                <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5 3" />
                    <path d="M30 65 L70 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <path d="M30 35 L70 65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
            </div>
        </div>
    );
};

export default NotFoundPage;