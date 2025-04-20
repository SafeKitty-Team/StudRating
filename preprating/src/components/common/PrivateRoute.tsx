import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
    children: React.ReactNode;
    roles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
    const { isAuthenticated, user } = useAuth();

    // Проверяем, авторизован ли пользователь
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Если указаны роли, проверяем, имеет ли пользователь нужную роль
    if (roles && user && !roles.includes(user.roles)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;