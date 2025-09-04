import { z } from 'zod';

export const userNotificationSchema = z.object({
    _id: z.string(),
    user: z.string(),
    notification: z.string(),
    read: z.boolean(),
});

export const markReadRequestSchema = z.object({
    notificationId: z.string(),
});

export const markReadResponseSchema = z.object({
    success: z.boolean(),
});

export type UserNotificationData = z.infer<typeof userNotificationSchema>;
export type MarkReadRequest = z.infer<typeof markReadRequestSchema>;

export interface MarkReadResponse {
    updated: boolean;
}
