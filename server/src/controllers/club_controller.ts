import { Request, Response } from 'express';
import Club from '../models/club_schema';
import User from '../models/user_schema';

export const createClub = async (req: Request, res: Response) => {
    const { name, members, motto, description, tags, club_logo } = req.body;

    try {
        // user can enter a logo when they create the club, but there should be a default
        // maybe will have default autofilled values in the club creation page bc idk how to do that here
        // idk how default values will be handled but that's not an urgent issue rn
        // can tags be empty?
        const newClub = new Club({
            name: name,
            members: members,
            motto: motto,
            description: description,
            tags: tags,
            club_logo: club_logo,
        });
        const result = await newClub.save();
        return res.status(201).json({ newClub: result });
    } catch (error) {
        return res.status(500).json({ error: 'Error creating club' });
    }
};

export const joinClub = async (req: Request, res: Response) => {
    const { user_id, club_id } = req.body;

    // look thru user club[] to find club_id to see if user is already in the club
    const user = await User.findById(user_id);
    const club = await Club.findById(club_id);
    if (!user) {
        return res.status(200).json({ error: 'User not found' });
    } else if (!club) {
        return res.status(200).json({ error: 'Club not found' });
    } else if (user.clubs.includes(club_id)) {
        return res.status(200).json({ error: 'User is already in club' });
    }

    try {
        user.clubs.push(club_id);
        club.members.push(user_id);
        await user.save();
        await club.save();
    } catch (error) {
        return res.status(500).json({ error: 'Error joining club' });
    }
};
