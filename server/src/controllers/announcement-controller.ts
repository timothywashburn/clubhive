import { Request, Response } from 'express';
import Announcement from '../models/announcement-schema';
import Clubs from '../models/club-schema';
import UserNotification from '@/models/user-notification-schema';
import ClubMembership from '@/models/club-membership-schema';

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

        const memberships = await ClubMembership.find({ club: club });

        if (!memberships.length) {
            return res.status(404).json({ error: 'No members found for this club' });
        }

        const userNotifs = memberships.map(
            membership =>
                new UserNotification({
                    user: membership.userId,
                    notificationId: result._id,
                    read: false,
                })
        );

        await UserNotification.insertMany(userNotifs);

        res.status(201).json({ newAnnouncement: result });
    } catch (error) {
        res.status(500).json({ err: 'Error creating announcement', error });
    }
};

export const getNotifications = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
    }

    try {
        const userNotifs = await UserNotification.find({ user: userId });

        const notifications = (
            await Promise.all(
                userNotifs.map(async entry => {
                    const notif = await Announcement.findById(entry.notification).lean();
                    if (!notif) return null;

                    const club = await Clubs.findById(notif.club, 'name').lean();
                    const clubName = club?.name ?? 'Unknown Club';

                    return {
                        _id: notif._id,
                        title: notif.title,
                        body: notif.body,
                        pictures: notif.pictures,
                        clubName: clubName,
                        date: notif.createdAt,
                        read: entry.read,
                        userNotifId: entry._id,
                    };
                })
            )
        )
            .filter(notif => notif !== null)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        res.status(200).json({ success: true, notifications });
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
