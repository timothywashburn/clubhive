import { ApiEndpoint, AuthType } from '@/types/api-types';
import { UpdateUserResponse, UpdateUserRequest, updateUserRequestSchema } from '@clubhive/shared/src';
import UserController from '@/controllers/user-controller';

export const updateUserEndpoint: ApiEndpoint<UpdateUserRequest, UpdateUserResponse> = {
    path: '/api/user/change-email',
    method: 'put',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const id = req.auth?.userId;
            const updates = updateUserRequestSchema.parse(req.body);

            if (!id) {
                res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
                return;
            }

            const user = await UserController.updateUser(id, updates);
            if (!user) {
                res.status(404).json({ success: false, error: { message: 'User not found' } });
                return;
            }

            res.json({ success: true, updated: true });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ success: false, error: { message: 'Error updating user' } });
        }
    },
};
