import { ApiEndpoint, AuthType } from '@/types/api-types';
import { LeaveMembershipResponse, ClubRole } from '@clubhive/shared';
import ClubMembershipController from '@/controllers/club-membership-controller';

export const leaveMembershipEndpoint: ApiEndpoint<undefined, LeaveMembershipResponse> = {
    path: '/api/memberships/:clubId',
    method: 'delete',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const clubId = req.params.clubId;
            const userId = req.auth?.userId;

            if (!clubId) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Club ID is required',
                    },
                });
                return;
            }

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: {
                        message: 'User not authenticated',
                    },
                });
                return;
            }

            const userRole = await ClubMembershipController.getUserClubRole(clubId, userId);

            if (!userRole) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'You are not a member of this club',
                    },
                });
                return;
            }

            if (userRole === ClubRole.OWNER) {
                res.status(403).json({
                    success: false,
                    error: {
                        message: 'Club owners cannot leave. You must transfer ownership or disband the club first.',
                    },
                });
                return;
            }

            await ClubMembershipController.deleteMembership(clubId, userId);

            res.json({
                success: true,
                message: 'Successfully left the club',
            });
        } catch (error) {
            console.error('Error leaving club:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to leave club',
                },
            });
        }
    },
};
