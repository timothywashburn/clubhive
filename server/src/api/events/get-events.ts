import { GetEventsResponse, eventSchema, getEventsQuerySchema, clubSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import EventController from '@/controllers/event-controller';
import ClubController from '@/controllers/club-controller';
import Club from '@/models/club-schema';
import ClubMembershipController from '@/controllers/club-membership-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';
import { z } from 'zod';

export const getEventsEndpoint: ApiEndpoint<undefined, GetEventsResponse> = {
    path: '/api/events',
    method: 'get',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            const queryResult = getEventsQuerySchema.safeParse(req.query);
            if (!queryResult.success) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid query parameters',
                    },
                });
                return;
            }

            const { clubId } = queryResult.data;

            let events;
            if (clubId) {
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

                const includeUnpublished = await ClubMembershipController.isOfficerOrOwner(clubId, userId);
                events = await EventController.getEventsByClub(clubId, includeUnpublished);
            } else {
                events = await EventController.getAllEvents();
            }

            res.json({
                success: true,
                events: events.map(event => eventSchema.parse(serializeRecursive(event))),
            });
        } catch (error) {
            let message = 'Error getting events';
            if (error instanceof z.ZodError) {
                message = error.issues[0].message;
            }
            console.error('Error getting events:', error);
            res.status(500).json({
                success: false,
                error: {
                    message,
                },
            });
        }
    },
};
