import { GetUserResponse, userWithCountsSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import UserController from '@/controllers/user-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';

export const getUserEndpoint: ApiEndpoint<undefined, GetUserResponse> = {
    path: '/api/users/:id',
    method: 'get',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            const { id } = req.params;

            const user = await UserController.getUserById(id);

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
