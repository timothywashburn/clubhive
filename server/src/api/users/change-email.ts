import { AuthType, ApiEndpoint } from '@/types/api-types';
import { ChangeEmailResponse, ChangeEmailRequest } from '@clubhive/shared';
import UserController from '@/controllers/user-controller';

export const changeEmailEndpoint: ApiEndpoint<ChangeEmailRequest, ChangeEmailResponse> = {
    path: '/api/me/change-email',
    method: 'put',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        const userId = req.auth?.userId;
        const email = req.body.email;

        if (!email || typeof email !== 'string') {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid email' },
            });
        }

        try {
            await UserController.updateUserEmail(userId, email);
            res.status(200).json({ success: true, changed: true });
        } catch (e) {
            console.error('Error updating email:', e);
            res.status(500).json({
                success: false,
                error: { message: 'Failed to update email' },
            });
        }
    },
};
