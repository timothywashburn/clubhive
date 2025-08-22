import { GetClubMembersResponse } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import ClubMembershipController from '@/controllers/club-membership-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';

export const getClubMembersEndpoint: ApiEndpoint<undefined, GetClubMembersResponse> = {
    path: '/api/clubs/:clubId/members',
    method: 'get',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const { clubId } = req.params;
            const members = await ClubMembershipController.getClubMembers(clubId);

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
