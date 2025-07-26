import { Request, Response } from 'express';
import User from '../models/user-schema';
import Auth from '../models/auth-schema';

export const createUser = async (req: Request, res: Response) => {
    const { name, school, major, educationType, year, email, password } =
        req.body;

    const existing = await Auth.findOne({ email: email });
    if (existing) {
        res.status(400).json({ error: 'User already exists' });
        return;
    }
    try {
        const newUser = new User({
            name: name,
            school: school,
            major: major,
            educationType: educationType,
            year: year,
        });
        const result = await newUser.save();

        const newAuth = new Auth({
            email: email,
            password: password,
            emailVerified: false,
        });
        const result2 = await newAuth.save();

        // unsure exactly how to create the authToken

        res.status(201).json({ newUser: result, newAuth: result2 });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
};
