import { Request, Response } from 'express';
import Announcement from '../models/announcement-schema';

export const createAnnouncement = async (req: Request, res: Response) => {
    const { club, title, body, pictures } = req.body;

    try {
        const newAnnouncement = new Announcement({
            club: club,
            title: title,
            body: body,
            pictures: pictures,
        });
        const result = await newAnnouncement.save();
        res.status(201).json({ newAnnouncement: result });
    } catch (error) {
        res.status(500).json({ error: 'Error creating announcement' });
    }
};
