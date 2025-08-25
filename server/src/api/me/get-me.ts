import { GetUserResponse, userWithCountsSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import UserController from '@/controllers/user-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';

export const getMeEndpoint: ApiEndpoint<undefined, GetUserResponse> = {
    path: '/api/me',
    method: 'get',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const userId = req.auth!.userId;

            const user = await UserController.getUserById(userId);

            if (!user) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'User not found',
                    },
                });
                return;
            }

            res.json({
                success: true,
                user: userWithCountsSchema.parse(serializeRecursive(user)),
            });
        } catch (error) {
            console.error('Error fetching current user:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error fetching user',
                },
            });
        }
    },
};
