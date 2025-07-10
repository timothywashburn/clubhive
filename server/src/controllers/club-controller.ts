import { Request, Response } from 'express';
import Club from '../models/club-schema';
import User from '../models/user-schema';

export const createClub = async (req: Request, res: Response) => {
    const { name, members, motto, description, tags, clubLogo } = req.body;

    try {
        // user can enter a logo when they create the club, but there should be a default
        // maybe will have default autofilled values in the club creation page bc idk how to do that here
        // idk how default values will be handled
        const newClub = new Club({
            name: name,
            members: members,
            motto: motto,
            description: description,
            tags: tags,
            clubLogo: clubLogo,
        });
        const result = await newClub.save();
        return res.status(201).json({ newClub: result });
    } catch (error) {
        return res.status(500).json({ error: 'Error creating club' });
    }
};

export const joinClub = async (req: Request, res: Response) => {
    const { userId, clubId } = req.body;

    // look thru user club[] to find club_id to see if user is already in the club
    const user = await User.findById(userId);
    const club = await Club.findById(clubId);
    if (!user) {
        return res.status(200).json({ error: 'User not found' });
    } else if (!club) {
        return res.status(200).json({ error: 'Club not found' });
    } else if (user.clubs.includes(clubId)) {
        return res.status(200).json({ error: 'User is already in club' });
    }

    try {
        user.clubs.push(clubId);
        club.members.push(userId);
        await user.save();
        await club.save();
    } catch (error) {
        return res.status(500).json({ error: 'Error joining club' });
    }
};
