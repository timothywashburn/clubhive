import { Request, Response } from 'express';
import Event from '../models/event-schema';
import SavedEvents from '../models/saved-events';

export const createEvent = async (req: Request, res: Response) => {
    const {
        name,
        tags,
        date,
        start_time,
        end_time,
        location_name,
        location_address,
        club,
        picture,
        description,
        event_type,
        location_description,
        requirements,
    } = req.body;

    try {
        const newEvent = new Event({
            name: name,
            tags: tags,
            date: date,
            start_time: start_time,
            end_time: end_time,
            location_name: location_name,
            location_address: location_address,
            club: club,
            picture: picture,
            description: description,
            event_type: event_type,
            location_description: location_description,
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
        user_id: user,
        event_id: event,
    });
    if (eventIsSaved) {
        console.log('Event is saved.');
        return res
            .status(400)
            .json({ error: 'Event is already saved to user' });
    }
    try {
        const saved_at = Date.now();
        const saveEvent = new SavedEvents({
            user: user,
            event: event,
            saved_at: saved_at,
        });
        const result = await saveEvent.save();
        res.status(201).json({ saveEvent: result });
    } catch (error) {
        res.status(500).json({ error: 'Error saving event ' });
    }
};
