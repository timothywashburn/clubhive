import { ApiEndpoint, AuthType } from '@/types/api-types';
import NotificationController from '@/controllers/notification-controller';

export const getNotificationsEndpoint: ApiEndpoint<undefined, any> = {
    path: '/api/notifications',
    method: 'get',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        const userId = req.auth?.userId;

        if (!userId) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'Invalid user id',
                },
            });
            return;
        }

        await NotificationController.getNotifications(req, res);
    },
};
