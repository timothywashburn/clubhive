import { UpdateEventRequest, UpdateEventResponse, updateEventRequestSchema, eventSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import EventController from '@/controllers/event-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';
import { z } from 'zod';

export const updateEventEndpoint: ApiEndpoint<UpdateEventRequest, UpdateEventResponse> = {
    path: '/api/events/:eventId',
    method: 'put',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const data = updateEventRequestSchema.parse(req.body);
            const eventId = req.params.eventId;
            const event = await EventController.updateEvent(eventId, data);

            if (!event) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Event not found',
                    },
                });
                return;
            }

            res.json({
                success: true,
                data: {
                    event: eventSchema.parse(serializeRecursive(event)),
                },
            });
        } catch (error) {
            let message = 'Error updating event';
            if (error instanceof z.ZodError) {
                message = error.issues[0].message;
            }
            console.error('Error updating event:', error);
            res.status(400).json({
                success: false,
                error: {
                    message,
                },
            });
        }
    },
};
