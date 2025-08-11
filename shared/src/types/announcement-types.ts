import { z } from 'zod';

export const announcementSchema = z.object({
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

export const postAnnouncementRequestSchema = z.object({
    club: z.string(),
    title: z.string(),
    body: z.string(),
    pictures: z.array(z.string()),
});

export const postAnnouncementResponseSchema = z.object({
    success: z.boolean(),
});

export type AnnouncementData = z.infer<typeof announcementSchema>;

export type PostAnnouncementRequest = z.infer<typeof postAnnouncementRequestSchema>;
export type PostAnnouncementResponse = z.infer<typeof postAnnouncementResponseSchema>;

export type NotifDisplayData = z.infer<typeof notifDisplaySchema>;
