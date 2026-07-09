export interface NotificationPayload {
    action: string;
    organizationId: string;
    details: string;
    timestamp: string;
}
export declare function sendAdminNotification(payload: NotificationPayload): Promise<void>;
