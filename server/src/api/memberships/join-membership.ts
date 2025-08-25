import { ApiEndpoint, AuthType } from '@/types/api-types';
import { CreateMembershipRequest } from '@clubhive/shared';
import ClubMembershipController from '@/controllers/club-membership-controller';

// endpoint for creating regular membership (not owner or officer)
export const joinMembershipEndpoint: ApiEndpoint<CreateMembershipRequest, undefined> = {
    path: '/api/memberships/:clubId',
    method: 'post',
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

            await ClubMembershipController.createMembership(clubId, userId, 'member');
            res.json({
                success: true,
                message: 'Successfully joined club',
            });
        } catch (error) {
            console.error('Error joining club:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to join club',
                },
            });
        }
    },
};
