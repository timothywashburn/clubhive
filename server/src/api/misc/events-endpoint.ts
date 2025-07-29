import { ApiEndpoint, AuthType } from '@/types/api-types';
import { Request, Response } from 'express';
import { ErrorCode } from '@clubhive/shared';
import Event from '@/models/event-schema';
import EventData from '@/models/event-schema';

export type EventsResponse = {
    events: {
        _id: string;
        name: string;
        description: string;
        date: string;
        club: {
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
            const event = await Event.find().populate('club', 'name url').populate('tags', 'name').exec();

            const formattedEvents = event.map(event => ({
                _id: event._id.toString(),
                name: event.name,
                description: event.description,
                date: event.date,
                club: {
                    name: (event.club as any).name,
                    url: (event.club as any).url,
                },
                tags: (event.tags as any[]).map(tag => tag.name),
            }));

            res.json({
                success: true,
                data: { events: formattedEvents },
            });
            return;
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

export const getEventByIdEndpoint: ApiEndpoint<null, any> = {
    method: 'get',
    path: '/api/events/:id',
    auth: AuthType.NONE,

    handler: async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const event = await Event.findById(id).populate('club', 'name url').populate('tags', 'name').exec();

            if (!event) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Event not found',
                        code: ErrorCode.NOT_FOUND,
                    },
                });
                return;
            }

            res.json({
                success: true,
                data: {
                    _id: event._id.toString(),
                    name: event.name,
                    description: event.description,
                    date: event.date,
                    location: event.location,
                    startTime: event.startTime,
                    endTime: event.endTime,
                    club: {
                        name: (event.club as any).name,
                        url: (event.club as any).url,
                    },
                    tags: (event.tags as any[]).map(tag => tag.name),
                },
            });
            return;
        } catch (err) {
            console.error('Failed to fetch event by ID:', err);
            const message = err instanceof Error ? err.message : 'Unknown error';
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch event',
                    code: ErrorCode.INTERNAL_SERVER_ERROR,
                    details: process.env.NODE_ENV === 'development' ? message : undefined,
                },
            });
        }
    },
};
