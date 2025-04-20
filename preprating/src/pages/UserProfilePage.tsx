import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { reviewsApi } from '../api/reviewsApi';
import { Review } from '../models/types';
import ReviewCard from '../components/reviews/ReviewCard';
import '../styles/userProfilePage.css';

const UserProfilePage: React.FC = () => {
    const { user, logout } = useAuth();
    const [userReviews, setUserReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'reviews' | 'settings'>('reviews');
    const [error, setError] = useState<string | null>(null);

    // Получение отзывов пользователя
    useEffect(() => {
        const fetchUserReviews = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Здесь должен быть API-запрос для получения отзывов конкретного пользователя
                // В текущей документации API такого эндпоинта нет, поэтому используем заглушку
                // const reviews = await someApi.getUserReviews();

                // Временная заглушка - получаем все отзывы
                const allReviews = await reviewsApi.getAllReviews();
                // Фильтруем отзывы (в реальном API это делалось бы на сервере)
                // Эта логика условная, так как в текущем API нет привязки отзывов к пользователям
                setUserReviews(allReviews.slice(0, 5)); // Берем первые 5 отзывов для примера
            } catch (err) {
                console.error('Ошибка при загрузке отзывов пользователя:', err);
                setError('Не удалось загрузить ваши отзывы. Пожалуйста, попробуйте позже.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserReviews();
    }, []);

    // Обработчик удаления отзыва
    const handleDeleteReview = (reviewId: number) => {
        setUserReviews(prev => prev.filter(review => review.id !== reviewId));
    };

    // Форматирование даты
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Обработчик выхода из системы
    const handleLogout = async () => {
        if (window.confirm('Вы уверены, что хотите выйти из системы?')) {
            await logout();
        }
    };

    return (
        <div className="user-profile-page">
            <div className="profile-header">
                <div className="profile-info">
                    <div className="profile-avatar">
                        {user?.email?.charAt(0).toUpperCase() || 'У'}
                    </div>
                    <div className="profile-details">
                        <h1 className="profile-name">{user?.email || 'Пользователь'}</h1>
                        <p className="profile-role">Роль: {user?.roles || 'user'}</p>
                        <p className="profile-date">Аккаунт создан: {user?.created_at ? formatDate(user.created_at) : 'Неизвестно'}</p>
                    </div>
                </div>
                <div className="profile-actions">
                    <button className="btn btn-outline" onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Выйти
                    </button>
                </div>
            </div>

            <div className="profile-tabs">
                <button
                    className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tab-icon">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    Мои отзывы
                </button>
                <button
                    className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tab-icon">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Настройки
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'reviews' && (
                    <div className="user-reviews">
                        <h2 className="section-title">Ваши отзывы</h2>

                        {error && <div className="error-message">{error}</div>}

                        {isLoading ? (
                            <div className="loading">
                                <div className="loading-spinner"></div>
                                <p>Загрузка отзывов...</p>
                            </div>
                        ) : userReviews.length === 0 ? (
                            <div className="no-reviews">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                </svg>
                                <p>У вас пока нет отзывов</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => window.location.href = '/review/new'}
                                >
                                    Оставить первый отзыв
                                </button>
                            </div>
                        ) : (
                            <div className="reviews-list">
                                {userReviews.map(review => (
                                    <ReviewCard
                                        key={review.id}
                                        review={review}
                                        onDelete={handleDeleteReview}
                                        showModeration={false}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="user-settings">
                        <h2 className="section-title">Настройки профиля</h2>

                        <div className="settings-card">
                            <h3>Сменить пароль</h3>
                            <form className="settings-form">
                                <div className="form-group">
                                    <label htmlFor="current-password">Текущий пароль</label>
                                    <input
                                        type="password"
                                        id="current-password"
                                        className="form-control"
                                        placeholder="Введите текущий пароль"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="new-password">Новый пароль</label>
                                    <input
                                        type="password"
                                        id="new-password"
                                        className="form-control"
                                        placeholder="Введите новый пароль"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirm-password">Подтвердите пароль</label>
                                    <input
                                        type="password"
                                        id="confirm-password"
                                        className="form-control"
                                        placeholder="Подтвердите новый пароль"
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary">
                                    Сохранить
                                </button>
                            </form>
                        </div>

                        <div className="settings-card danger-zone">
                            <h3>Опасная зона</h3>
                            <p className="settings-description">
                                Эти действия нельзя отменить. Будьте внимательны.
                            </p>

                            <button className="btn btn-danger">
                                Удалить учетную запись
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfilePage;