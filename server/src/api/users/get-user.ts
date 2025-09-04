import { GetUserResponse, userWithCountsSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import UserController from '@/controllers/user-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';
import Auth from '@/models/auth-schema';

export const getUserEndpoint: ApiEndpoint<undefined, GetUserResponse> = {
    path: '/api/users/get-user',
    method: 'get',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const id = (req as any)?.auth?.userId;

            const user = await UserController.getUserById(id);
            const email = await UserController.getUserEmail(id);

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
                user: userWithCountsSchema.parse({
                    ...serializeRecursive(user),
                    email,
                }),
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error fetching user',
                },
            });
        }
    },
};
