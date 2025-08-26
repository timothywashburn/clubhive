import { ApiEndpoint, AuthType } from '@/types/api-types';
import { DeleteNotificationResponse } from '@clubhive/shared';
import Notification from '@/models/notification-schema';
import UserNotification from '@/models/user-notification-schema';

export const deleteNotificationEndpoint: ApiEndpoint<undefined, DeleteNotificationResponse> = {
    path: '/api/notifications/:id',
    method: 'delete',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const id = req.params.id;

            const deleted = await Notification.findByIdAndDelete(id);
            if (!deleted) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Notification not found',
                    },
                });
                return;
            }

            await UserNotification.deleteMany({ notification: id });

            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting notification:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error deleting notification',
                },
            });
        }
    },
};
