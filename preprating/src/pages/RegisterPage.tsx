import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/authPages.css';

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const { register, isLoading, error } = useAuth();
    const navigate = useNavigate();

    const validatePassword = () => {
        if (password.length < 8) {
            setPasswordError('Пароль должен содержать не менее 8 символов');
            return false;
        }
        if (password !== confirmPassword) {
            setPasswordError('Пароли не совпадают');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePassword()) return;

        try {
            await register(email, password);
            navigate('/');
        } catch (err) {
            // Ошибка обрабатывается в контексте авторизации
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1 className="auth-title">Регистрация в ПрепРейтинг</h1>
                <p className="auth-description">
                    Создайте аккаунт, чтобы оставлять отзывы и помогать другим студентам
                </p>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-input"
                            placeholder="user@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="form-input"
                                placeholder="Минимум 8 символов"
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Подтверждение пароля</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="form-input"
                            placeholder="Повторите пароль"
                        />
                        {passwordError && (
                            <div className="form-error">{passwordError}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                    </button>
                </form>

                <div className="auth-links">
                    <div className="login-link-container">
                        <span>Уже есть аккаунт?</span>
                        <Link to="/login" className="login-link">
                            Войти
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;