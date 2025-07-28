import { z } from 'zod';
import { tagSchema } from './club-types';

export enum EventType {
    CLUB_OFFICERS = 'Club Officers',
    CLUB_MEMBERS = 'Club Members',
    UCSD_STUDENTS = 'UCSD Students',
    ANYONE = 'Anyone',
}

export const eventSchema = z.object({
    _id: z.string(),
    club: z.string(),
    name: z.string(),
    description: z.string(),
    type: z.enum(EventType),
    location: z.string(),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    picture: z.string().optional(),
    tags: z.array(tagSchema),
});

export const createEventRequestSchema = z.object({
    club: z.string(),
    name: z.string(),
    description: z.string().optional(),
    type: z.enum(EventType),
    location: z.string(),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    picture: z.string().optional(),
    tags: z.array(z.string()),
});

export const updateEventRequestSchema = z.object({
    club: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    type: z.enum(EventType).optional(),
    location: z.string().optional(),
    date: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    picture: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

export type EventData = z.infer<typeof eventSchema>;
export type CreateEventRequest = z.infer<typeof createEventRequestSchema>;
export type UpdateEventRequest = z.infer<typeof updateEventRequestSchema>;

export interface CreateEventResponse {
    event: EventData;
}

export interface GetEventsResponse {
    events: EventData[];
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
