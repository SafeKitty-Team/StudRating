import React from 'react';
import '../../styles/loadingScreen.css';

interface LoadingScreenProps {
    message?: string;
}

/**
 * Компонент для отображения экрана загрузки
 * @param message - Необязательное сообщение для отображения во время загрузки
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({
                                                         message = 'Загрузка...'
                                                     }) => {
    return (
        <div className="loading-screen">
            <div className="loading-spinner-container">
                <div className="loading-spinner"></div>
            </div>
            <p className="loading-message">{message}</p>
        </div>
    );
};

export default LoadingScreen;