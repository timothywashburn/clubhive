import { ApiEndpoint, ApiRequest, ApiResponse, AuthType } from '@/types/api-types';
import Club from '@/models/club-schema';
import { ClubData } from '@/models/club-schema';
import '@/models/school-schema';
import '@/models/image-schema';
import '@/models/tag-schema';
import { ErrorCode } from '@clubhive/shared';
import mongoose from 'mongoose';

type GetClubRequest = { clubId: string };
type GetClubResponse = { club: ClubData };

export const getClubProfileEndpoint: ApiEndpoint<GetClubRequest, GetClubResponse> = {
    method: 'get',
    path: '/api/clubs/:clubId',
    auth: AuthType.NONE,
    handler: async (req: ApiRequest<GetClubRequest>, res: ApiResponse<GetClubResponse>): Promise<void> => {
        const { clubId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(clubId)) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'Invalid club ID format',
                    code: 'BAD_REQUEST' as any, // TODO: edit this check for valid clubId block
                },
            });
            return;
        }

        try {
            const club = await Club.findById(clubId).populate('school').populate('tags').exec();
            //add .populate('clubLogo') and 'pictures' later

            if (!club) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Club not found',
                        code: ErrorCode.NOT_FOUND,
                    },
                });

                return;
            }
            res.json({
                success: true,
                data: { club },
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unkown error';

            console.error('🔥 Failed to fetch club:', err); // ← Add this line

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch club',
                    code: ErrorCode.INTERNAL_SERVER_ERROR,
                    details: process.env.NODE_ENV === 'development' ? message : undefined,
                },
            });
        }
    },
};
