import { ApiEndpoint, AuthType } from '@/types/api-types';
import { getNotifications } from '@/controllers/announcement-controller';

export const getNotificationsEndpoint: ApiEndpoint<undefined, any> = {
    path: '/api/notifications/:userId',
    method: 'get',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        const userId = req.params.userId;

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
