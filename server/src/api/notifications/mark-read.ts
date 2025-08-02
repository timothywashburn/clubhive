import { ApiEndpoint, AuthType } from '@/types/api-types';
import UserNotification from '@/models/user-notification-schema';
import { MarkReadRequest, MarkReadResponse } from '@clubhive/shared/src/types';

export const markReadEndpoint: ApiEndpoint<MarkReadRequest, MarkReadResponse> = {
    path: '/api/notifications/mark-read',
    method: 'put',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        const { notificationId } = req.body;

        try {
            const result = await UserNotification.updateOne({ _id: notificationId }, { $set: { read: true } });

            if (result.modifiedCount === 0) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Notification not found',
                    },
                });
                return;
            }

            res.status(200).json({
                success: true,
                updated: true,
            });
        } catch (err) {
            console.error('Error marking notification as read: ', err);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to update notification',
                },
            });
        }
    },
};
