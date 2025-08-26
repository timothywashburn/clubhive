import { GetUsersResponse, userWithCountsSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import UserController from '@/controllers/user-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';

export const getUsersEndpoint: ApiEndpoint<undefined, GetUsersResponse> = {
    path: '/api/users',
    method: 'get',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            const users = await UserController.getAllUsers();

            res.json({
                success: true,
                users: users.map(user => userWithCountsSchema.parse(serializeRecursive(user))),
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error fetching users',
                },
            });
        }
    },
};
