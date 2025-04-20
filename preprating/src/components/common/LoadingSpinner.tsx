import React from 'react';
import '../styles/loadingScreen.css';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    message?: string;
    fullPage?: boolean;
}

/**
 * A reusable loading spinner component
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                           size = 'medium',
                                                           message = 'Загрузка...',
                                                           fullPage = false
                                                       }) => {
    const sizeClasses = {
        small: 'loading-spinner-small',
        medium: 'loading-spinner-medium',
        large: 'loading-spinner-large'
    };

    if (fullPage) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner-container">
                    <div className={`loading-spinner ${sizeClasses[size]}`}></div>
                </div>
                {message && <p className="loading-message">{message}</p>}
            </div>
        );
    }

    return (
        <div className="loading-inline">
            <div className={`loading-spinner ${sizeClasses[size]}`}></div>
            {message && <p className="loading-inline-message">{message}</p>}
        </div>
    );
};

export default LoadingSpinner;