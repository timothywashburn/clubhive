import { ApiEndpoint, AuthType } from '@/types/api-types';
import { EventData } from '@clubhive/shared';
import SavedEvents from '@/models/saved-events';
import Event from '@/models/event-schema';
import { serializeRecursive } from '@/utils/db-doc-utils';

export interface GetSavedEventsResponse {
    events: EventData[];
}

export const getSavedEventsEndpoint: ApiEndpoint<undefined, GetSavedEventsResponse> = {
    path: '/api/saved-events',
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

            const savedEventDocs = await SavedEvents.find({ user: userId })
                .populate({
                    path: 'event',
                    populate: {
                        path: 'tags',
                    },
                })
                .exec();

            const savedEvents = savedEventDocs
                .filter(savedDoc => savedDoc.event && (savedDoc.event as any).published)
                .map(savedDoc => savedDoc.event);

            res.json({
                success: true,
                events: savedEvents.map(event => serializeRecursive(event)),
            });
        } catch (error) {
            console.error('Error fetching saved events:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error fetching saved events',
                },
            });
        }
    },
};
