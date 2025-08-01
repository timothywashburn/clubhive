import { DeleteClubResponse } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import ClubController from '@/controllers/club-controller';

export const deleteClubEndpoint: ApiEndpoint<undefined, DeleteClubResponse> = {
    path: '/api/clubs/:id',
    method: 'delete',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const clubId = req.params.id;
            const deleted = await ClubController.deleteClub(clubId);

            if (!deleted) {
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
                deleted: true,
            });
        } catch (error) {
            console.error('Error deleting club:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error deleting club',
                },
            });
        }
    },
};
