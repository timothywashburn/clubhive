import { UserClubDataResponse, UserClubData } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import ClubMembershipController from '@/controllers/club-membership-controller';
import { ClubRole } from '@clubhive/shared';

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
            const success = await ClubMembershipController.updateMemberRole(clubId, memberId, userRole as ClubRole);

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
