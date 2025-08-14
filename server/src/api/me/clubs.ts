import { GetMyClubsResponse, userClubSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import ClubController from '@/controllers/club-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';

export const getMyClubsEndpoint: ApiEndpoint<undefined, GetMyClubsResponse> = {
    path: '/api/me/clubs',
    method: 'get',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const userId = req.auth?.userId;
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

export const getClubMembersEndpoint: ApiEndpoint<{ clubId: string }, any> = {
    path: '/api/clubs/:clubId/members',
    method: 'get',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const { clubId } = req.params;
            const members = await ClubController.getClubMembers(clubId);

            res.json({
                success: true,
                members: members.map(m => serializeRecursive(m)),
            });
        } catch (error) {
            console.error('Error fetching club members:', error);
            res.status(500).json({
                success: false,
                error: { message: 'Error fetching club members' },
            });
        }
    },
};
