import { ApiEndpoint, AuthType } from '@/types/api-types';
import { ErrorCode } from '@clubhive/shared';
import Club from '@/models/club-schema';
import { ClubData } from '@/models/club-schema';

export interface GetClubsResponse {
    clubs: ClubData[];
}

export const testGetClubsEndpoint: ApiEndpoint<undefined, GetClubsResponse> = {
    path: '/api/clubs',
    method: 'get',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            const clubs = await Club.find().populate('tags').exec();

            res.json({
                success: true,
                data: { clubs },
            });
        } catch (err) {
            console.error('Failed to fetch clubs:', err);
            const message =
                err instanceof Error ? err.message : 'Unknown error';
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch clubs',
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
