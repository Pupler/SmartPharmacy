import { useEffect } from "react";
import './Notification.css';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
    duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
    message,
    type,
    onClose,
    duration = 3000
}) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getIcon = () => {
        switch(type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'info': return 'ℹ️';
            default: return '💡';
        }
    };

    return (
        <div className={`notification notification-${type}`}>
        <span className="notification-icon">{getIcon()}</span>
        <span className="notification-message">{message}</span>
        <button 
            className="notification-close" 
            onClick={onClose}
            aria-label="Close notification"
        >
            ×
        </button>
        </div>  
    );
};

export default Notification;