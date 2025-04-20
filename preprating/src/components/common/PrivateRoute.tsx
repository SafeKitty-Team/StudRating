import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
    children: React.ReactNode;
    roles?: string[];
    redirectTo?: string;
}

/**
 * Компонент для защиты маршрутов, требующих авторизации или определенной роли
 * @param children - Дочерние компоненты, которые будут отображены при успешной авторизации
 * @param roles - Массив ролей, имеющих доступ к маршруту (если не указан, то доступ для любого авторизованного пользователя)
 * @param redirectTo - URL для перенаправления при отсутствии доступа (по умолчанию /login)
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({
                                                       children,
                                                       roles = [],
                                                       redirectTo = '/login'
                                                   }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    // Проверка авторизации пользователя
    if (isLoading) {
        return (
            <div className="private-route-loading">
                <div className="loading-spinner"></div>
                <p>Проверка авторизации...</p>
            </div>
        );
    }

    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (!isAuthenticated) {
        // Сохраняем текущий URL для возврата после авторизации
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Если указаны роли и у пользователя нет необходимой роли
    if (roles.length > 0 && user && !roles.includes(user.roles)) {
        // Перенаправляем на главную или другую страницу, если нет доступа
        return <Navigate to="/" replace />;
    }

    // Если все проверки пройдены, рендерим дочерние компоненты
    return <>{children}</>;
};

export default PrivateRoute;