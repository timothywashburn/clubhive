import { CreateClubRequest, CreateClubResponse, createClubRequestSchema, clubSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import ClubController from '@/controllers/club-controller';
import ClubMembershipController from '@/controllers/club-membership-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';
import { z } from 'zod';

export const createClubEndpoint: ApiEndpoint<CreateClubRequest, CreateClubResponse> = {
    path: '/api/clubs',
    method: 'post',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const data = createClubRequestSchema.parse(req.body);
            const club = await ClubController.createClub(data);
            await ClubMembershipController.createMembership(club._id.toString(), req.auth!.userId, 'owner');

            res.json({
                success: true,
                club: clubSchema.parse(serializeRecursive(club)),
            });
        } catch (error) {
            let message = 'Error creating club';
            if (error instanceof z.ZodError) {
                message = error.issues[0].message;
            }
            console.error('Error creating club:', error);
            res.status(400).json({
                success: false,
                error: {
                    message,
                },
            });
        }
    },
};
