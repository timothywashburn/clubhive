import { z } from 'zod';

export const clubSnapshotSchema = z.object({
    _id: z.string(),
    date: z.string(),
    clubs: z.array(
        z.object({
            clubId: z.string(),
            memberCount: z.number(),
        })
    ),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type ClubSnapshotData = z.infer<typeof clubSnapshotSchema>;
