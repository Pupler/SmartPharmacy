export interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const initialNotificationState: NotificationState = {
  show: false,
  message: '',
  type: 'success'
};