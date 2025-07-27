import { ApiEndpoint, AuthType } from '@/types/api-types';
import { Request, Response } from 'express';
import { ErrorCode } from '@clubhive/shared';
import Event from '@/models/event-schema';
import EventData from '@/models/event-schema';

export type EventsResponse = {
    events: {
        _id: string;
        title: string;
        description: string;
        date: string;
        hostingClub: {
            name: string;
            url: string;
        };
        tags: string[];
    }[];
};

export const getEventsEndpoint: ApiEndpoint<null, EventsResponse> = {
    method: 'get',
    path: '/api/events',
    auth: AuthType.NONE,

    handler: async (_req: Request, res: Response) => {
        try {
            const events = await Event.find().populate('club', 'name url').populate('tags', 'name').exec();

            const formattedEvents = events.map(event => ({
                _id: event._id.toString(),
                title: event.name,
                description: event.description,
                date: event.date,
                hostingClub: {
                    name: (event.club as any).name,
                    url: (event.club as any).url,
                },
                tags: (event.tags as any[]).map(tag => tag.name),
            }));

            res.json({
                success: true,
                data: { events: formattedEvents },
            });
        } catch (err) {
            console.error('Failed to fetch events:', err);
            const message = err instanceof Error ? err.message : 'Unknown error';
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch events',
                    code: ErrorCode.INTERNAL_SERVER_ERROR,
                    details: process.env.NODE_ENV === 'development' ? message : undefined,
                },
            });
        }
    },
};
