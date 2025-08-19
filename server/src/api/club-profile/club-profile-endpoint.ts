import { ApiEndpoint, ApiRequest, ApiResponse, AuthType } from '@/types/api-types';
import Club from '@/models/club-schema';
import Event from '@/models/event-schema';
import ClubMembership from '@/models/club-membership-schema';
import '@/models/school-schema';
import '@/models/image-schema';
import '@/models/tag-schema';
import { ClubData, clubWithEventsAndCountsSchema, ClubWithEventsData, ErrorCode } from '@clubhive/shared';
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
            const club = await Club.findOne({ url }).populate('school').populate('tags').exec();
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

            const now = new Date();
            const allEvents = await Event.find({
                club: club._id,
            })
                .populate('tags')
                .sort({ date: 1 })
                .exec();
            const memberCount = await ClubMembership.countDocuments({ club: club._id }).exec();
            const upcomingEvents = allEvents.filter(event => new Date(event.date) >= now);
            const pastEvents = allEvents.filter(event => new Date(event.date) <= now);

            res.json({
                success: true,
                club: clubWithEventsAndCountsSchema.parse({
                    ...serializeRecursive(club),
                    upcomingEvents: serializeRecursive(upcomingEvents) ?? [],
                    pastEvents: serializeRecursive(pastEvents) ?? [],
                    eventCount: allEvents.length,
                    memberCount,
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
