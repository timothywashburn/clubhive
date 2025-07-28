import { GetEventsResponse, eventSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import EventController from '@/controllers/event-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';
import { z } from 'zod';

export const getEventsEndpoint: ApiEndpoint<undefined, GetEventsResponse> = {
    path: '/api/events',
    method: 'get',
    auth: AuthType.AUTHENTICATED,
    handler: async (req, res) => {
        try {
            const events = await EventController.getAllEvents();

            res.json({
                success: true,
                data: {
                    events: events.map(event => eventSchema.parse(serializeRecursive(event))),
                },
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
