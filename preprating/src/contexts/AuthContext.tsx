import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/authApi';
import { User } from '../models/types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
}

// Создаем контекст авторизации
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API для получения данных пользователя
const getUserInfo = async (token: string): Promise<User | null> => {
    try {
        // Здесь предполагается, что у нас есть API-метод для получения данных пользователя
        // В реальном приложении его нужно реализовать в соответствующем API-сервисе
        const response = await fetch('http://localhost:8000/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Не удалось получить данные пользователя');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        return null;
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    // Проверка токена при загрузке приложения
    useEffect(() => {
        const initializeAuth = async () => {
            if (token) {
                try {
                    const userData = await getUserInfo(token);
                    setUser(userData);
                } catch (err) {
                    // Если токен недействителен, очищаем данные авторизации
                    console.error('Ошибка при инициализации авторизации:', err);
                    localStorage.removeItem('auth_token');
                    setToken(null);
                    setUser(null);
                }
            }
            setIsInitializing(false);
        };

        initializeAuth();
    }, [token]);

    // Авторизация пользователя
    const login = async (username: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await authApi.login({ username, password });

            // Сохраняем токен в localStorage и состоянии
            localStorage.setItem('auth_token', data.access_token);
            setToken(data.access_token);

            // Получаем данные пользователя
            const userData = await getUserInfo(data.access_token);
            setUser(userData);
        } catch (err: any) {
            let errorMessage = 'Ошибка при входе в систему';

            if (err.response) {
                // Если есть ответ от сервера с ошибкой
                if (err.response.status === 401) {
                    errorMessage = 'Неверный email или пароль';
                } else if (err.response.data?.detail) {
                    errorMessage = err.response.data.detail;
                }
            }

            setError(errorMessage);
            console.error('Ошибка входа:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Регистрация нового пользователя
    const register = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await authApi.register({ email, password });
            // После регистрации автоматически входим
            await login(email, password);
        } catch (err: any) {
            let errorMessage = 'Ошибка при регистрации';

            if (err.response) {
                if (err.response.status === 400) {
                    errorMessage = 'Пользователь с таким email уже существует';
                } else if (err.response.data?.detail) {
                    errorMessage = err.response.data.detail;
                }
            }

            setError(errorMessage);
            console.error('Ошибка регистрации:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Выход из системы
    const logout = async () => {
        setIsLoading(true);
        try {
            // Вызываем API для выхода из системы
            await authApi.logout();

            // Удаляем токен и данные пользователя
            localStorage.removeItem('auth_token');
            setToken(null);
            setUser(null);
        } catch (err) {
            // Даже если выход не удался на сервере, все равно очищаем данные локально
            localStorage.removeItem('auth_token');
            setToken(null);
            setUser(null);
            console.error('Ошибка выхода:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Очистка ошибки авторизации
    const clearError = () => {
        setError(null);
    };

    // Показываем загрузчик, пока проверяем токен при инициализации
    if (isInitializing) {
        return (
            <div className="auth-initializing">
                <div className="loading-spinner"></div>
                <p>Загрузка приложения...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token,
            login,
            register,
            logout,
            isLoading,
            error,
            clearError
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Хук для использования контекста авторизации
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }
    return context;
};