import { z } from 'zod';

export const notificationSchema = z.object({
    _id: z.string(),
    club: z.string(),
    title: z.string(),
    body: z.string(),
    pictures: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const notifDisplaySchema = z.object({
    _id: z.string(),
    club: z.string(),
    title: z.string(),
    body: z.string(),
    pictures: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string(),
    read: z.boolean(),
    date: z.string(),
    clubName: z.string(),
    userNotifId: z.string(),
});

export const getNotificationResponseSchema = z.object({
    success: z.boolean(),
    notifications: z.array(notificationSchema),
});

export const postNotificationRequestSchema = z.object({
    club: z.string(),
    title: z.string(),
    body: z.string(),
    pictures: z.array(z.string()),
});

export const postNotificationResponseSchema = z.object({
    success: z.boolean(),
});

export const deleteNotificationResponseSchema = z.object({
    success: z.boolean(),
});

export type NotificationData = z.infer<typeof notificationSchema>;

export type PostNotificationRequest = z.infer<typeof postNotificationRequestSchema>;
export type PostNotificationResponse = z.infer<typeof postNotificationResponseSchema>;

export type DeleteNotificationResponse = z.infer<typeof deleteNotificationResponseSchema>;

export type GetNotificationResponse = z.infer<typeof getNotificationResponseSchema>;

export type NotifDisplayData = z.infer<typeof notifDisplaySchema>;
