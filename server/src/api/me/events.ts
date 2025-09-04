import { GetMyEventsResponse } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import EventController from '@/controllers/event-controller';
import ClubController from '@/controllers/club-controller';
import SavedEvents from '@/models/saved-events';
import { serializeRecursive } from '@/utils/db-doc-utils';

export const getMyEventsEndpoint: ApiEndpoint<undefined, GetMyEventsResponse> = {
    path: '/api/me/events',
    method: 'get',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const userId = req.auth?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: {
                        message: 'User not authenticated',
                    },
                });
                return;
            }

            // Get user's clubs
            const userClubs = await ClubController.getClubsByUserId(userId);
            const clubIds = userClubs.map(({ doc }) => doc._id.toString());

            // Get upcoming events from user's clubs (only published events, future dates)
            const today = new Date().toISOString().split('T')[0];
            const upcomingEvents = [];

            for (const { doc: club } of userClubs) {
                const clubEvents = await EventController.getEventsByClub(club._id.toString(), false); // only published
                const futureEvents = clubEvents.filter(event => event.date >= today);
                // Add club name, logo, and URL to each event
                const eventsWithClubInfo = futureEvents.map(event => ({
                    ...event.toObject(),
                    clubName: club.name,
                    clubLogo: club.clubLogo,
                    clubUrl: club.url,
                }));
                upcomingEvents.push(...eventsWithClubInfo);
            }

            // Sort upcoming events by date
            upcomingEvents.sort((a, b) => {
                if (a.date !== b.date) {
                    return a.date.localeCompare(b.date);
                }
                return a.startTime.localeCompare(b.startTime);
            });

            // Get saved events
            const savedEventDocs = await SavedEvents.find({ user: userId })
                .populate({
                    path: 'event',
                    populate: [{ path: 'tags' }, { path: 'club', select: 'name clubLogo' }],
                })
                .exec();

            const savedEvents = savedEventDocs
                .filter(savedDoc => savedDoc.event && (savedDoc.event as any).published)
                .map(savedDoc => {
                    const event = (savedDoc.event as any).toObject();
                    return {
                        ...event,
                        clubName: event.club?.name || 'Unknown Club',
                        clubLogo: event.club?.clubLogo || null,
                        clubUrl: event.club?.url || null,
                    };
                }); // Only include published saved events

            res.json({
                success: true,
                upcomingEvents: upcomingEvents.map(event => serializeRecursive(event)),
                savedEvents: savedEvents.map(event => serializeRecursive(event)),
            });
        } catch (error) {
            console.error('Error fetching user events:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error fetching user events',
                },
            });
        }
    },
};
