import { Request, Response } from 'express';
import Club from '../models/club-schema';
import ClubMembership from '@/models/club-membership-schema';

export const createClub = async (req: Request, res: Response) => {
    const {
        school,
        name,
        tagline,
        description,
        website,
        discord,
        instagram,
        tags,
        clubLogo,
    } = req.body;

    try {
        // user can enter a logo when they create the club, but there should be a default
        // maybe will have default autofilled values in the club creation page bc idk how to do that here
        // idk how default values will be handled
        const newClub = new Club({
            school: school, // get this from the user who is creating the club
            name: name,
            tagline: tagline,
            description: description,
            socials: {
                website: website,
                discord: discord,
                instagram: instagram,
            },
            tags: tags,
            clubLogo: clubLogo,
        });
        const result = await newClub.save();
        res.status(201).json({ newClub: result });
    } catch (error) {
        res.status(500).json({ error: 'Error creating club' });
    }
};

export const joinClub = async (req: Request, res: Response) => {
    const { userId, clubId } = req.body;

    // look through club memberships
    const isMember = await ClubMembership.findOne({
        userId: userId,
        clubId: clubId,
    });
    if (isMember) {
        res.status(200).json({ error: 'User is already in club' });
        return;
    }

    try {
        const newMember = new ClubMembership({
            userId: userId,
            clubId: clubId,
            role: 'Member',
        });
        const result = await newMember.save();
        res.status(201).json({ newMember: result });
    } catch (error) {
        res.status(500).json({ error: 'Error joining club' });
    }
};
