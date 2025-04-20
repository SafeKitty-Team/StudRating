import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/header.css';

const Header: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { mode, toggleTheme, isDark } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Отслеживаем прокрутку для изменения стиля хедера
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Закрываем меню при изменении маршрута
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
            <div className="header-container">
                <Link to="/" className="logo">
                    <span className="logo-icon">★</span>
                    <span className="logo-text">ПрепРейтинг</span>
                </Link>

                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Поиск преподавателей, предметов..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                        aria-label="Поиск"
                    />
                    <button type="submit" className="search-button" aria-label="Искать">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </form>

                <nav className={`main-nav ${isMenuOpen ? 'nav-open' : ''}`}>
                    <Link to="/subjects" className="nav-link">Предметы</Link>
                    <Link to="/professors" className="nav-link">Преподаватели</Link>
                    <Link to="/faculties" className="nav-link">Факультеты</Link>

                    {isAuthenticated && (user?.roles === 'admin' || user?.roles === 'superuser') && (
                        <Link to="/admin" className="nav-link nav-admin">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                            </svg>
                            Управление
                        </Link>
                    )}
                </nav>

                <div className="header-actions">
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label={isDark ? 'Включить светлую тему' : 'Включить темную тему'}
                    >
                        {isDark ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        )}
                    </button>

                    {isAuthenticated ? (
                        <div className="user-menu">
                            <button className="user-button">
                <span className="user-avatar">
                  {user?.email?.charAt(0).toUpperCase() || 'У'}
                </span>
                            </button>
                            <div className="user-dropdown">
                                <Link to="/profile" className="dropdown-item">Профиль</Link>
                                <Link to="/my-reviews" className="dropdown-item">Мои отзывы</Link>
                                <button onClick={() => logout()} className="dropdown-item logout-button">
                                    Выйти
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="login-button">
                                Войти
                            </Link>
                        </div>
                    )}

                    <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Меню">
                        <span className="menu-icon"></span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;