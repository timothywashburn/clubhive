import { ApiEndpoint, AuthType } from '@/types/api-types';
import { PostAnnouncementRequest, PostAnnouncementResponse } from '@clubhive/shared/src/types';
import { createAnnouncement } from '@/controllers/announcement-controller';

export const postAnnouncementEndpoint: ApiEndpoint<PostAnnouncementRequest, PostAnnouncementResponse> = {
    path: '/api/announcements',
    method: 'post',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        const { club, title, body, pictures } = req.body || {};

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
            await createAnnouncement(req, res);
        } catch (err) {
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to create announcement.' + err,
                },
            });
        }
    },
};
