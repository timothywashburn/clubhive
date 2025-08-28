import { ApiEndpoint, AuthType } from '@/types/api-types';
import UserController from '@/controllers/user-controller';
import { ChangePasswordRequest, ChangePasswordResponse } from '@clubhive/shared/src';

export const changePasswordEndpoint: ApiEndpoint<ChangePasswordRequest, ChangePasswordResponse> = {
    path: '/api/me/change-password',
    method: 'put',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        const userId = req.auth?.userId;
        const { currentPassword, newPassword } = req.body || {};

        if (!userId) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'User not authenticated',
                },
            });
            return;
        }

        if (!currentPassword || !newPassword) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'Invalid password',
                },
            });
        }

        try {
            await UserController.changePassword(userId, currentPassword, newPassword);
            res.status(200).json({ success: true, changed: true });
        } catch (e) {
            console.error('Error updating password:', e);
            res.status(500).json({
                success: false,
                error: { message: 'Failed to update password' },
            });
        }
    },
};
