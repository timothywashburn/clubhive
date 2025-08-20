import { ApiEndpoint, AuthType } from '@/types/api-types';
import { getNotifications } from '@/controllers/notification-controller';
import { GetNotificationRequest, GetNotificationResponse } from '@clubhive/shared/src';

export const getNotificationsEndpoint: ApiEndpoint<GetNotificationRequest, GetNotificationResponse> = {
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

        await getNotifications(req, res);
    },
};
