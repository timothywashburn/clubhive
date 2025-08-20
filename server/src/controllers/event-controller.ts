import { CreateEventRequest, UpdateEventRequest } from '@clubhive/shared';
import Event, { EventDoc, EventSchema } from '../models/event-schema';
import { updateDocument } from '@/utils/db-doc-utils';

export default class EventController {
    static async createEvent(data: CreateEventRequest): Promise<EventSchema> {
        const newEvent = new Event({
            club: data.club,
            name: data.name,
            description: data.description || '',
            type: data.type,
            location: data.location,
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            picture: data.picture,
            tags: data.tags,
        });

        const result = await newEvent.save();
        const populatedEvent = await Event.findById(result._id).populate('tags').exec();

        return populatedEvent!;
    }

    static async getAllEvents(): Promise<EventDoc[]> {
        const filter = { published: true };
        return await Event.find(filter).populate('tags').exec();
    }

    static async getEventsByClub(clubId: string, includeUnpublished: boolean = false): Promise<EventDoc[]> {
        const filter = includeUnpublished ? { club: clubId } : { club: clubId, published: true };
        return await Event.find(filter).populate('tags').exec();
    }

    static async getEventById(eventId: string): Promise<EventDoc | null> {
        return await Event.findById(eventId).populate('picture').populate('tags').exec();
    }

    static async updateEvent(id: string, updates: UpdateEventRequest): Promise<EventDoc> {
        const result = await updateDocument(Event, id, updates);
        await result.populate('tags');
        return result;
    }

    static async deleteEvent(id: string): Promise<boolean> {
        const result = await Event.findByIdAndDelete(id).exec();
        return result !== null;
    }
}
