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

    // TODO: should have a parameter to decide if unpublished events should be returned
    static async getAllEvents(): Promise<EventDoc[]> {
        return await Event.find({}).populate('tags').exec();
    }

    // TODO: should have a parameter to decide if unpublished events should be returned
    static async getEventsByClub(clubId: string): Promise<EventDoc[]> {
        return await Event.find({ club: clubId }).populate('tags').exec();
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
