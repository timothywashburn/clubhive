import { GetClubResponse, clubSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import Club from '@/models/club-schema';
import { serializeRecursive } from '@/utils/db-doc-utils';

export const getClubEndpoint: ApiEndpoint<undefined, GetClubResponse> = {
    path: '/api/clubs/:id',
    method: 'get',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const { id } = req.params;

            const club = await Club.findById(id).populate('school').populate('tags').exec();

            if (!club) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Club not found',
                    },
                });
                return;
            }

            res.json({
                success: true,
                club: clubSchema.parse(serializeRecursive(club)),
            });
        } catch (error) {
            console.error('Error fetching club:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error fetching club',
                },
            });
        }
    },
};
