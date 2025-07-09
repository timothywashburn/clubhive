import { Request, Response } from 'express';
import User from '../models/user_schema';

export const createUser = async (req: Request, res: Response) => {
    const { email, password, school, major, year } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
        return res.status(400).json({ error: 'User already exists' });
    }
    try {
        const newUser = new User({ email, password, school, major, year });
        const result = await newUser.save();
        res.status(201).json({ newUser: result });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
};
