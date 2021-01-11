import { NotificationAction } from './notification-action.enum';

// Notification Data Model Interface Definition
export default interface NotificationData {
    action: NotificationAction,
    data?: any,
    errors?: any
}