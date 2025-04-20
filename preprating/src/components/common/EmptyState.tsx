import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    actionText?: string;
    actionLink?: string;
    onAction?: () => void;
}

/**
 * A reusable empty state component to display when no data is available
 */
const EmptyState: React.FC<EmptyStateProps> = ({
                                                   title,
                                                   description,
                                                   icon,
                                                   actionText,
                                                   actionLink,
                                                   onAction
                                               }) => {
    return (
        <div className="empty-state">
            {icon && <div className="empty-state-icon">{icon}</div>}
            <h2 className="empty-state-title">{title}</h2>
            <p className="empty-state-description">{description}</p>

            {actionText && (actionLink || onAction) && (
                <>
                    {actionLink ? (
                        <Link to={actionLink} className="btn btn-primary">
                            {actionText}
                        </Link>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={onAction}
                        >
                            {actionText}
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default EmptyState;