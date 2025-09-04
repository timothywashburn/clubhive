import { GetClubOfficersResponse } from '@clubhive/shared'; // Import the new type
import { ApiEndpoint, AuthType } from '@/types/api-types';
import ClubMembershipController from '@/controllers/club-membership-controller';
import { ClubRole } from '@clubhive/shared';

export const getClubOfficersEndpoint: ApiEndpoint<undefined, GetClubOfficersResponse> = {
    path: '/api/clubs/:clubId/officers',
    method: 'get',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            const { clubId } = req.params;
            const members = await ClubMembershipController.getClubMembers(clubId);

            const officers = members
                .filter(
                    member =>
                        member.role === ClubRole.OFFICER || member.role === ClubRole.OWNER || member.role === ClubRole.PRINCIPAL_MEMBER
                )
                .map(member => ({
                    role: member.role,
                    name: member.user?.name || 'Unknown',
                }));

            res.json({
                success: true,
                officers,
            });
        } catch (error) {
            console.error('Error fetching club officers:', error);
            res.status(500).json({
                success: false,
                error: { message: 'Error fetching club officers' },
            });
        }
    },
};
