import { ApiEndpoint, ApiRequest, ApiResponse, AuthType } from '@/types/api-types';
import Club from '@/models/club-schema';
import { ClubData } from '@/models/club-schema';
import '@/models/school-schema';
import '@/models/image-schema';
import '@/models/tag-schema';
import { ErrorCode } from '@clubhive/shared';

type GetClubRequest = { url: string };
type GetClubResponse = { club: ClubData };

export const getClubProfileEndpoint: ApiEndpoint<GetClubRequest, GetClubResponse> = {
    method: 'get',
    path: '/api/clubs/by-url/:url',
    auth: AuthType.NONE,
    handler: async (req: ApiRequest<GetClubRequest>, res: ApiResponse<GetClubResponse>): Promise<void> => {
        const { url } = req.params;

        try {
            const club = await Club.findOne({ url }).populate('school').populate('tags').populate('clubLogo').exec();
            //add .populate('pictures') later

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

            //for troubleshooting:
            console.error('Failed to fetch club:', err);

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
