import { ApiEndpoint, AuthType } from '@/types/api-types';
import EventController from '@/controllers/event-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';
import { eventSchema } from '@clubhive/shared';
import { z } from 'zod';

export const getEventByIdEndpoint: ApiEndpoint<undefined, any> = {
    path: '/api/events/:id',
    method: 'get',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            const { id } = req.params;

            if (typeof id !== 'string') {
                res.status(400).json({ success: false, error: { message: 'Invalid event ID' } });
            }

            const event = await EventController.getEventById(id);

            if (!event) {
                res.status(404).json({ success: false, error: { message: 'Event not found' } });
            }

            res.json({
                success: true,
                data: eventSchema.parse(serializeRecursive(event)),
            });
        } catch (error) {
            let message = 'Error getting event';
            if (error instanceof z.ZodError) {
                message = error.issues[0].message;
            }
            console.error('Error getting event:', error);
            res.status(500).json({ success: false, error: { message } });
        }
    },
};
