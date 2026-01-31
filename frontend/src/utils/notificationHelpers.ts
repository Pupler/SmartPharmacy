import type { NotificationState } from '../types/notification';

export const showNotification = (
  setNotification: React.Dispatch<React.SetStateAction<NotificationState>>,
  message: string,
  type: 'success' | 'error' | 'info'
) => {
  setNotification({
    show: true,
    message,
    type
  });
};