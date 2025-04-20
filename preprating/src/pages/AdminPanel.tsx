import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Review, User } from '../models/types';
import '../styles/adminPanel.css';

// Имитация API для получения отзывов на модерации
const fetchReviewsOnModeration = async (): Promise<Review[]> => {
    // В реальном приложении здесь был бы запрос к API
    return [];
};

// Имитация API для получения пользователей
const fetchUsers = async (): Promise<User[]> => {
    // В реальном приложении здесь был бы запрос к API
    return [];
};

const AdminPanel: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'reviews' | 'users' | 'courses' | 'professors'>('reviews');
    const [moderationReviews, setModerationReviews] = useState<Review[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Проверяем, имеет ли пользователь доступ к админ-панели
        if (isAuthenticated && user && (user.roles === 'admin' || user.roles === 'superuser')) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const [reviewsData, usersData] = await Promise.all([
                        fetchReviewsOnModeration(),
                        fetchUsers()
                    ]);
                    setModerationReviews(reviewsData);
                    setUsers(usersData);
                } catch (error) {
                    console.error('Error fetching admin data:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        } else {
            // Если пользователь не авторизован или не имеет прав админа, перенаправляем на главную
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    const handleApproveReview = async (reviewId: number) => {
        try {
            // API запрос для одобрения отзыва
            // await approveReview(reviewId);

            // Обновляем список отзывов на модерации
            setModerationReviews(prev => prev.filter(review => review.id !== reviewId));
        } catch (error) {
            console.error('Error approving review:', error);
        }
    };

    const handleDeleteReview = async (reviewId: number) => {
        try {
            // API запрос для удаления отзыва
            // await deleteReview(reviewId);

            // Обновляем список отзывов на модерации
            setModerationReviews(prev => prev.filter(review => review.id !== reviewId));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    if (isLoading) {
        return <div className="loading">Загрузка...</div>;
    }

    return (
        <div className="admin-panel">
            <div className="admin-sidebar">
                <h2 className="admin-title">Панель администратора</h2>

                <nav className="admin-nav">
                    <button
                        className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Отзывы на модерации
                        {moderationReviews.length > 0 && (
                            <span className="badge">{moderationReviews.length}</span>
                        )}
                    </button>

                    <button
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Пользователи
                    </button>

                    <button
                        className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('courses')}
                    >
                        Управление курсами
                    </button>

                    <button
                        className={`nav-item ${activeTab === 'professors' ? 'active' : ''}`}
                        onClick={() => setActiveTab('professors')}
                    >
                        Управление преподавателями
                    </button>
                </nav>
            </div>

            <div className="admin-content">
                {activeTab === 'reviews' && (
                    <>
                        <h2>Отзывы, требующие модерации</h2>
                        {moderationReviews.length === 0 ? (
                            <p className="no-items">Нет отзывов, требующих модерации</p>
                        ) : (
                            <div className="moderation-reviews">
                                {moderationReviews.map(review => (
                                    <div key={review.id} className="moderation-review-card">
                                        <div className="review-entity">
                                            Отзыв на: {review.entity_type} #{review.entity_id}
                                        </div>
                                        <div className="review-content">
                                            <div className="review-ratings">
                                                <span>Общая оценка: {review.rating_overall}</span>
                                                <span>Сложность: {review.rating_difficulty}</span>
                                                <span>Полезность: {review.rating_usefulness}</span>
                                            </div>
                                            <div className="review-text">
                                                {review.text_review}
                                            </div>
                                        </div>
                                        <div className="review-actions">
                                            <button
                                                className="approve-btn"
                                                onClick={() => handleApproveReview(review.id)}
                                            >
                                                Одобрить
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteReview(review.id)}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'users' && (
                    <>
                        <h2>Управление пользователями</h2>
                        {users.length === 0 ? (
                            <p className="no-items">Нет пользователей</p>
                        ) : (
                            <table className="users-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>Роль</th>
                                    <th>Дата регистрации</th>
                                    <th>Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>user@example.com</td>
                                        <td>{user.roles}</td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button className="edit-btn">Изменить</button>
                                            <button className="delete-btn">Удалить</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </>
                )}

                {activeTab === 'courses' && (
                    <>
                        <h2>Управление курсами</h2>
                        <div className="admin-actions">
                            <button className="add-btn">Добавить курс</button>
                        </div>
                        {/* Здесь будет таблица с курсами */}
                    </>
                )}

                {activeTab === 'professors' && (
                    <>
                        <h2>Управление преподавателями</h2>
                        <div className="admin-actions">
                            <button className="add-btn">Добавить преподавателя</button>
                        </div>
                        {/* Здесь будет таблица с преподавателями */}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;