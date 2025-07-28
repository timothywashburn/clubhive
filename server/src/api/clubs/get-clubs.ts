import { GetClubsResponse, clubSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import ClubController from '@/controllers/club-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';

export const getClubsEndpoint: ApiEndpoint<undefined, GetClubsResponse> = {
    path: '/api/clubs',
    method: 'get',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const clubs = await ClubController.getAllClubs();

            res.json({
                success: true,
                data: {
                    clubs: clubs.map(club => clubSchema.parse(serializeRecursive(club))),
                },
            });
        } catch (error) {
            console.error('Error fetching clubs:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error fetching clubs',
                },
            });
        }
    },
};
