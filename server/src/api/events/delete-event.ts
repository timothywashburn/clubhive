import { DeleteEventResponse } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import EventController from '@/controllers/event-controller';

export const deleteEventEndpoint: ApiEndpoint<undefined, DeleteEventResponse> = {
    path: '/api/events/:eventId',
    method: 'delete',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const eventId = req.params.eventId;
            const deleted = await EventController.deleteEvent(eventId);

            if (!deleted) {
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
                deleted,
            });
        } catch (error) {
            console.error('Error deleting event:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error deleting event',
                },
            });
        }
    },
};
