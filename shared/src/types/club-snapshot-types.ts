import { z } from 'zod';

const majorDistributionItemSchema = z.object({
    major: z.string(),
    count: z.number(),
});

const clubSnapshotDataSchema = z.object({
    clubId: z.string(),
    memberCount: z.number(),
    newMembersToday: z.number(),
    leavingMembersToday: z.number(),
    eventSavesToday: z.number(),
    majorDistribution: z.array(majorDistributionItemSchema),
});

export const clubSnapshotSchema = z.object({
    _id: z.string(),
    date: z.string(),
    clubs: z.array(clubSnapshotDataSchema),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type ClubSnapshot = z.infer<typeof clubSnapshotSchema>;
