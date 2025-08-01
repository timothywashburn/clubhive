import { CreateEventRequest, CreateEventResponse, createEventRequestSchema, eventSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import EventController from '@/controllers/event-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';
import { z } from 'zod';

export const createEventEndpoint: ApiEndpoint<CreateEventRequest, CreateEventResponse> = {
    path: '/api/events',
    method: 'post',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const data = createEventRequestSchema.parse(req.body);
            const event = await EventController.createEvent(data);

            res.json({
                success: true,
                event: eventSchema.parse(serializeRecursive(event)),
            });
        } catch (error) {
            let message = 'Error creating event';
            if (error instanceof z.ZodError) {
                message = error.issues[0].message;
            }
            console.error('Error creating event:', error);
            res.status(400).json({
                success: false,
                error: {
                    message,
                },
            });
        }
    },
};
