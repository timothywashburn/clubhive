import { Request, Response } from 'express';
import Event from '../models/event-schema';
import SavedEvents from '../models/saved-events';

export const createEvent = async (req: Request, res: Response) => {
    const {
        club,
        name,
        description,
        type,
        location,
        date,
        startTime,
        endTime,
        picture,
        tags,
    } = req.body;

    try {
        const newEvent = new Event({
            club: club,
            name: name,
            description: description,
            type: type,
            location: location,
            date: date,
            startTime: startTime,
            endTime: endTime,
            picture: picture,
            tags: tags,
        });
        const result = await newEvent.save();
        res.status(201).json({ newEvent: result });
    } catch (error) {
        res.status(500).json({ error: 'Error creating event' });
    }
};

export const saveEvent = async (req: Request, res: Response) => {
    const { userId, eventId } = req.body;

    const eventIsSaved = await SavedEvents.findOne({
        userId: userId,
        eventId: eventId,
    });
    if (eventIsSaved) {
        console.log('Event is saved.');
        res.status(400).json({ error: 'Event is already saved to user' });
        return;
    }
    try {
        const saveEvent = new SavedEvents({
            userId: userId,
            eventId: eventId,
        });
        const result = await saveEvent.save();
        res.status(201).json({ saveEvent: result });
    } catch (error) {
        res.status(500).json({ error: 'Error saving event ' });
    }
};
