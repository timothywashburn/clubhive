import { Request, Response } from 'express';
import Notification from '../models/notification-schema';
import Clubs from '../models/club-schema';
import UserNotification from '@/models/user-notification-schema';
import ClubMembership from '@/models/club-membership-schema';

export default class NotificationController {
    static async createNotification(req: Request, res: Response) {
        const { club, title, body, pictures } = req.body;

        try {
            const newNotification = new Notification({
                club: club,
                title: title,
                body: body,
                pictures: pictures,
            });
            const result = await newNotification.save();

            const memberships = await ClubMembership.find({ club: club });

            if (!memberships.length) {
                return res.status(404).json({ error: 'No members found for this club' });
            }

            const userNotifs = memberships.map(
                membership =>
                    new UserNotification({
                        user: membership.user,
                        notification: result._id,
                        read: false,
                    })
            );

            await UserNotification.insertMany(userNotifs);

            res.status(201).json({ newNotification: result });
        } catch (error) {
            res.status(500).json({ err: 'Error creating notification', error });
        }
    }

    static async deleteAllNotificationsForClub(clubId: string): Promise<number> {
        const clubNotifications = await Notification.find({ club: clubId });
        const notificationIds = clubNotifications.map(notif => notif._id);

        await UserNotification.deleteMany({ notification: { $in: notificationIds } });

        const result = await Notification.deleteMany({ club: clubId });
        return result.deletedCount || 0;
    }

    static async getNotifications(req: Request, res: Response) {
        const userId = (req as any).auth?.userId;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        try {
            const userNotifs = await UserNotification.find({ user: userId });

            const notifications = (
                await Promise.all(
                    userNotifs.map(async entry => {
                        const notif = await Notification.findById(entry.notification).lean();
                        if (!notif) return null;

                        const club = await Clubs.findById(notif.club, 'name').lean();
                        const clubName = club?.name ?? 'Unknown Club';

                        return {
                            _id: notif._id,
                            title: notif.title,
                            body: notif.body,
                            pictures: notif.pictures,
                            club: String(notif.club),
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
    }
}
