import { ApiEndpoint, ApiRequest, ApiResponse, AuthType } from '@/types/api-types';
import Club from '@/models/club-schema';
import Event from '@/models/event-schema';
import '@/models/school-schema';
import '@/models/image-schema';
import '@/models/tag-schema';
import { ClubData, clubWithEventsAndCountsSchema, ErrorCode } from '@clubhive/shared';
import { serializeRecursive } from '@/utils/db-doc-utils';

type GetClubRequest = { url: string };
type GetClubResponse = { club: ReturnType<typeof clubWithEventsAndCountsSchema.parse> };

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

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const events = await Event.find({
                club: club._id,
                startTime: { $gte: today.toISOString().split('T')[0] },
            })
                .populate('tags')
                .sort({ date: 1 })
                .limit(20)
                .exec();

            res.json({
                success: true,
                club: clubWithEventsAndCountsSchema.parse({
                    ...serializeRecursive(club),
                    events: serializeRecursive(events) ?? [],
                    eventCount: events.length,
                }),
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unkown error';

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
