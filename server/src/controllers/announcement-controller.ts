import { Request, Response } from 'express';
import Announcement from '../models/announcement-schema';
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
                    user: membership.user,
                    notificationId: result._id,
                    read: false,
                })
        );

        await UserNotification.insertMany(userNotifs);

        res.status(201).json({ newAnnouncgement: result });
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
        const userNotifs = await UserNotification.find({ userId });

        const notifications = (
            await Promise.all(
                userNotifs.map(async entry => {
                    const notif = await Announcement.findById(entry.notification);
                    if (!notif) return null;

                    return {
                        ...notif.toObject(),
                        read: entry.read,
                        userNotif: entry._id,
                    };
                })
            )
        )
            .filter(notif => notif !== null)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        res.status(200).json({ notifications });
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
