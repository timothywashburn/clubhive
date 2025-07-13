import { Request, Response } from 'express';
import Event from '../models/event-schema';
import SavedEvents from '../models/saved-events';

export const createEvent = async (req: Request, res: Response) => {
    const {
        name,
        tags,
        date,
        startTime,
        endTime,
        locationName,
        locationAddress,
        club,
        picture,
        description,
        eventType,
        locationDescription,
        requirements,
    } = req.body;

    try {
        const newEvent = new Event({
            name: name,
            tags: tags,
            date: date,
            startTime: startTime,
            endTime: endTime,
            locationName: locationName,
            locationAddress: locationAddress,
            club: club,
            picture: picture,
            description: description,
            eventType: eventType,
            locationDescription: locationDescription,
            requirements: requirements,
        });
        const result = await newEvent.save();
        res.status(201).json({ newEvent: result });
    } catch (error) {
        res.status(500).json({ error: 'Error creating event' });
    }
};

export const saveEvent = async (req: Request, res: Response) => {
    const { user, event } = req.body;

    const eventIsSaved = await SavedEvents.findOne({
        userId: user,
        eventId: event,
    });
    if (eventIsSaved) {
        console.log('Event is saved.');
        return res
            .status(400)
            .json({ error: 'Event is already saved to user' });
    }
    try {
        const savedAt = Date.now();
        const saveEvent = new SavedEvents({
            user: user,
            event: event,
            saved_at: savedAt,
        });
        const result = await saveEvent.save();
        res.status(201).json({ saveEvent: result });
    } catch (error) {
        res.status(500).json({ error: 'Error saving event ' });
    }
};
