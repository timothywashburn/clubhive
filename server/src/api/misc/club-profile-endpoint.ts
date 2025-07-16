import {
    ApiEndpoint,
    ApiRequest,
    ApiResponse,
    AuthType,
} from '@/types/api-types';
import Club from '@/models/club-schema';
import { ClubData } from '@/models/club-schema';
import { ErrorCode } from '@clubhive/shared';

type GetClubRequest = { clubId: string };
type GetClubResponse = { club: ClubData };

export const getClubProfileEndpoint: ApiEndpoint<
    GetClubRequest,
    GetClubResponse
> = {
    method: 'get',
    path: '/api/clubs/:clubId',
    auth: AuthType.NONE,
    handler: async (
        req: ApiRequest<GetClubRequest>,
        res: ApiResponse<GetClubResponse>
    ) => {
        const { clubId } = req.params;

        try {
            const club = await Club.findById(clubId)
                .populate('school')
                .populate('name')
                .populate('tagline')
                .populate('description')
                .populate('url')
                .populate('socials')
                .populate('clubLogo')
                .populate('pictures')
                .populate('tags')
                .exec();

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

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch club',
                    code: ErrorCode.INTERNAL_SERVER_ERROR,
                    details:
                        process.env.NODE_ENV === 'development'
                            ? message
                            : undefined,
                },
            });
        }
    },
};
