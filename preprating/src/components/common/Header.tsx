import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/header.css';

const Header: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <span className="logo-icon">☆</span>
                    <span className="logo-text">ПрепРейтинг</span>
                </Link>

                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Поиск курсов, преподавателей..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        <span className="search-icon">🔍</span>
                    </button>
                </form>

                <nav className="main-nav">
                <Link to="/subjects" className="nav-link">Курсы</Link>
                <Link to="/professors" className="nav-link">Преподаватели</Link>
                <Link to="/faculties" className="nav-link">Кафедры</Link>
            </nav>

                <div className="auth-buttons">
                    {isAuthenticated ? (
                        <button className="logout-button" onClick={() => logout()}>
                            Выйти
                        </button>
                    ) : (
                        <Link to="/login" className="login-button">
                            Войти
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;