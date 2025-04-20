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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Проверка токена при загрузке приложения
        if (token) {
            // Можно сделать запрос для проверки токена и получения информации о пользователе
        }
    }, [token]);

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await authApi.login({ username, password });
            localStorage.setItem('auth_token', data.access_token);
            setToken(data.access_token);
            // Тут можно сделать дополнительный запрос для получения данных пользователя
            // setUser(userData);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Ошибка при входе');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await authApi.register({ email, password });
            // После регистрации автоматически входим
            await login(email, password);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Ошибка при регистрации');
            console.error('Register error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await authApi.logout();
            localStorage.removeItem('auth_token');
            setToken(null);
            setUser(null);
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token,
            login,
            register,
            logout,
            isLoading,
            error
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};