import { z } from 'zod';
import { tagSchema } from './tag-types.js';

export enum EventType {
    CLUB_OFFICERS = 'Club Officers',
    CLUB_MEMBERS = 'Club Members',
    UCSD_STUDENTS = 'UCSD Students',
    ANYONE = 'Anyone',
}

export const eventSchema = z.object({
    _id: z.string(),
    club: z.string(),
    name: z.string().max(100),
    description: z.string().max(1000).optional(),
    requirements: z.string().max(1000).optional(),
    type: z.enum(EventType),
    location: z.string().max(100),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    published: z.boolean(),
    picture: z.string().optional(),
    tags: z.array(tagSchema),
    clubName: z.string().optional(),
    clubLogo: z.string().nullable().optional(),
});

export const createEventRequestSchema = z.object({
    club: z.string(),
    name: z.string().max(100),
    description: z.string().max(1000).optional(),
    name: z.string(),
    description: z.string().optional(),
    requirements: z.string().optional(),
    type: z.enum(EventType),
    location: z.string().max(100),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    picture: z.string().optional(),
    tags: z.array(z.string()),
});

export const updateEventRequestSchema = z.object({
    club: z.string().optional(),
    name: z.string().max(100).optional(),
    description: z.string().max(1000).optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    requirements: z.string().optional(),
    type: z.enum(EventType).optional(),
    location: z.string().max(100).optional(),
    date: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    published: z.boolean().optional(),
    picture: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

export const getEventsQuerySchema = z.object({
    clubId: z.string().optional(),
});

export type EventData = z.infer<typeof eventSchema>;
export type CreateEventRequest = z.infer<typeof createEventRequestSchema>;
export type UpdateEventRequest = z.infer<typeof updateEventRequestSchema>;
export type GetEventsQuery = z.infer<typeof getEventsQuerySchema>;

export interface CreateEventResponse {
    event: EventData;
}

export interface GetEventsResponse {
    //events: EventData[];
    events: Array<{
        event: EventData;
        club: any;
    }>;
}

export interface GetEventResponse {
    event: EventData;
}

export interface UpdateEventResponse {
    event: EventData;
}

export interface DeleteEventResponse {
    deleted: boolean;
}

export interface GetMyEventsResponse {
    upcomingEvents: EventData[];
    savedEvents: EventData[];
}
