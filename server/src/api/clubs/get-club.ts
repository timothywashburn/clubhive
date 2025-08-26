import { GetClubResponse, clubSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import Club from '@/models/club-schema';
import Event from '@/models/event-schema';
import { serializeRecursive } from '@/utils/db-doc-utils';
import { clubWithEventsAndCountsSchema } from '@clubhive/shared';

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

            //fetch events
            const now = new Date();
            const events = await Event.find({
                club: id,
            })
                .populate('tags')
                .limit(20) //limit amount of events to send at once
                .exec();

            console.log('Fetched upcoming events:', events);

            res.json({
                success: true,
                club: clubWithEventsAndCountsSchema.parse({
                    ...serializeRecursive(club),
                    events: serializeRecursive(events) ?? [],
                }),
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
