import { ApiEndpoint, AuthType } from '@/types/api-types';
import SavedEvents from '@/models/saved-events';
import Event from '@/models/event-schema';

export interface ToggleSaveEventRequest {
    eventId: string;
    save: boolean;
}

export interface ToggleSaveEventResponse {
    saved: boolean;
}

export const toggleSaveEventEndpoint: ApiEndpoint<ToggleSaveEventRequest, ToggleSaveEventResponse> = {
    path: '/api/events/:eventId/save',
    method: 'post',
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

            const eventId = req.params.eventId;
            const { save } = req.body;

            if (!eventId) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Event ID is required',
                    },
                });
                return;
            }

            if (typeof save !== 'boolean') {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Save parameter must be a boolean',
                    },
                });
                return;
            }

            // Check if event exists
            const event = await Event.findById(eventId);
            if (!event) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Event not found',
                    },
                });
                return;
            }

            const existingSaved = await SavedEvents.findOne({ user: userId, event: eventId });

            if (save) {
                // Save the event
                if (!existingSaved) {
                    const savedEvent = new SavedEvents({
                        user: userId,
                        event: eventId,
                        savedAt: new Date(),
                    });
                    await savedEvent.save();
                }
                res.json({
                    success: true,
                    saved: true,
                });
            } else {
                // Unsave the event
                if (existingSaved) {
                    await SavedEvents.findOneAndDelete({ user: userId, event: eventId });
                }
                res.json({
                    success: true,
                    saved: false,
                });
            }
        } catch (error) {
            console.error('Error toggling save event:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error toggling save event',
                },
            });
        }
    },
};
