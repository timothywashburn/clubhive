import { ApiEndpoint, AuthType } from '@/types/api-types';
import { PostNotificationRequest, PostNotificationResponse } from '@clubhive/shared/src/types';
import NotificationController from '@/controllers/notification-controller';

export const postNotificationEndpoint: ApiEndpoint<PostNotificationRequest, PostNotificationResponse> = {
    path: '/api/notifications',
    method: 'post',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        const { club, title, body } = req.body || {};

        if (!club || !title || !body) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'Missing required fields: club, title, body.',
                },
            });
            return;
        }

        try {
            await NotificationController.createNotification(req, res);
        } catch (err) {
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to create notification.' + err,
                },
            });
        }
    },
};
