import { GetMyClubsResponse, userClubSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import ClubController from '@/controllers/club-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';

export const getMyClubsEndpoint: ApiEndpoint<undefined, GetMyClubsResponse> = {
    path: '/api/me/clubs',
    method: 'get',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            const userId = '507f1f77bcf86cd799439020'; // temporary: change when auth working
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: {
                        message: 'User not authenticated',
                    },
                });
                return;
            }

            const clubs = await ClubController.getClubsByUserId(userId);

            res.json({
                success: true,
                clubs: clubs.map(({ doc, userRole }) =>
                    userClubSchema.parse({
                        ...serializeRecursive(doc),
                        userRole,
                    })
                ),
            });
        } catch (error) {
            console.error('Error fetching user clubs:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error fetching user clubs',
                },
            });
        }
    },
};
