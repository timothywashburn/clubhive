import { UpdateClubRequest, UpdateClubResponse, updateClubRequestSchema, clubSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import ClubController from '@/controllers/club-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';
import { z } from 'zod';

export const updateClubEndpoint: ApiEndpoint<UpdateClubRequest, UpdateClubResponse> = {
    path: '/api/clubs/:id',
    method: 'put',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const clubId = req.params.id;
            const updates = updateClubRequestSchema.parse(req.body);
            const club = await ClubController.updateClub(clubId, updates);

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
            let message = 'Error updating club';
            if (error instanceof z.ZodError) {
                message = error.issues[0].message;
            }
            console.error('Error updating club:', error);
            res.status(400).json({
                success: false,
                error: {
                    message,
                },
            });
        }
    },
};
