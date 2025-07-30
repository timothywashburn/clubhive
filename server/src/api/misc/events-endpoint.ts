import { ApiEndpoint, AuthType } from '@/types/api-types';
import { Request, Response } from 'express';
import { ErrorCode } from '@clubhive/shared';
import Event from '@/models/event-schema';
import { EventData } from '@/models/event-schema';

export type EventsResponse = {
    events: EventData[];
};

export const getEventsEndpoint: ApiEndpoint<null, EventsResponse> = {
    method: 'get',
    path: '/api/events',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            const event = await Event.find().populate('club', 'name url').populate('tags', 'text').exec();
            res.json({
                success: true,
                data: { events: event },
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
    handler: async (req, res) => {
        const { id } = req.params;
        try {
            const event = await Event.findById(id).populate('club', 'name url').populate('tags', 'text').exec();
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
                data: { event },
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
