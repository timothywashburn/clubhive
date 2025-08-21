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
});

export type AnnouncementData = z.infer<typeof announcementSchema>;

export type NotifDisplayData = z.infer<typeof notifDisplaySchema>;
