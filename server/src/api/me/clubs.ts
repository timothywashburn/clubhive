import { GetMyClubsResponse, userClubSchema, GetClubMembersResponse, UserClubDataResponse, UserClubData } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import ClubController from '@/controllers/club-controller';
import { ClubRole } from '@clubhive/shared';
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

export const getClubMembersEndpoint: ApiEndpoint<undefined, GetClubMembersResponse> = {
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

export const updateMemberRoleEndpoint: ApiEndpoint<UserClubData, UserClubDataResponse> = {
    path: '/api/clubs/:clubId/members/:memberId/role',
    method: 'put',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const { clubId, memberId } = req.params as { clubId: string; memberId: string };
            const { userRole } = req.body;

            if (!userRole || typeof userRole !== 'string') {
                res.status(400).json({
                    success: false,
                    error: { message: 'Invalid role provided' },
                });
                return;
            }
            const success = await ClubController.updateMemberRole(clubId, memberId, userRole as ClubRole);

            if (success) {
                res.json({
                    success: true,
                    message: 'Role updated successfully',
                });
            } else {
                res.status(404).json({
                    success: false,
                    error: { message: 'Club member not found' },
                });
            }
        } catch (error) {
            console.error('Error updating member role:', error);
            res.status(500).json({
                success: false,
                error: { message: 'Error updating member role' },
            });
        }
    },
};
