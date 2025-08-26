import { ApiEndpoint, AuthType } from '@/types/api-types';
import ClubMembershipController from '@/controllers/club-membership-controller';

export const removeMemberEndpoint: ApiEndpoint<undefined, undefined> = {
    path: '/api/clubs/:clubId/members/:memberId',
    method: 'delete',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const { clubId, memberId } = req.params as { clubId: string; memberId: string };

            const success = await ClubMembershipController.removeMemberFromClub(clubId, memberId);

            if (success) {
                res.json({
                    success: true,
                });
            } else {
                res.status(404).json({
                    success: false,
                    error: { message: 'Club member not found' },
                });
            }
        } catch (error) {
            console.error('Error removing member:', error);
            res.status(500).json({
                success: false,
                error: { message: 'Error removing member' },
            });
        }
    },
};
