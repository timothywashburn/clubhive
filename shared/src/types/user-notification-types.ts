import { z } from 'zod';

export const userNotificationSchema = z.object({
    _id: z.string(),
    user: z.string(),
    notification: z.string(),
    read: z.boolean(),
});

export type UserNotificationData = z.infer<typeof userNotificationSchema>;
