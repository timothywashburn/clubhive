import { z } from 'zod';
import { ClubRole } from './club-membership-types.js';
import { schoolSchema } from './school-types.js';
import { tagSchema } from './tag-types.js';

export const clubSchema = z.object({
    _id: z.string(),
    school: schoolSchema,
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    url: z.string(),
    socials: z.object({
        website: z.string().optional(),
        discord: z.string().optional(),
        instagram: z.string().optional(),
    }),
    clubLogo: z.string().nullable().optional(),
    pictures: z.array(z.string()),
    tags: z.array(tagSchema),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const clubWithCountsSchema = clubSchema.extend({
    memberCount: z.number(),
    eventCount: z.number(),
});

export const createClubRequestSchema = z.object({
    school: z.string().min(1, 'School is required'),
    name: z.string().min(1, 'Club name is required'),
    tagline: z.string().max(50, 'Tagline must be 50 characters or less').optional(),
    description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
    url: z
        .string()
        .regex(/^[a-zA-Z0-9_-]+$/, 'URL can only contain letters, numbers, hyphens, and underscores')
        .max(50, 'URL must be 50 characters or less')
        .optional(),
    socials: z
        .object({
            website: z
                .string()
                .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]*)?$/, 'Invalid website URL format')
                .transform(s => (s ? `https://${s}` : undefined))
                .optional(),
            discord: z
                .string()
                .regex(/^[a-zA-Z0-9_-]+$/, 'Discord invite can only contain letters, numbers, hyphens, and underscores')
                .transform(s => (s ? `https://discord.com/invite/${s}` : undefined))
                .optional(),
            instagram: z
                .string()
                .regex(/^[a-zA-Z0-9_.]+$/, 'Instagram username can only contain letters, numbers, periods, and underscores')
                .transform(s => (s ? `https://www.instagram.com/${s}` : undefined))
                .optional(),
        })
        .optional(),
    clubLogo: z.string().optional(),
    pictures: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
});

export const updateClubRequestSchema = z.object({
    school: z.string().optional(),
    name: z.string().optional(),
    tagline: z.string().optional(),
    description: z.string().optional(),
    url: z.string().optional(),
    socials: z
        .object({
            website: z.string().optional(),
            discord: z.string().optional(),
            instagram: z.string().optional(),
        })
        .optional(),
    clubLogo: z.string().optional(),
    pictures: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
});

export const userClubSchema = clubSchema.extend({
    userRole: z.enum(ClubRole),
});

export type ClubData = z.infer<typeof clubSchema>;
export type ClubWithCountsData = z.infer<typeof clubWithCountsSchema>;
export type UserClubData = z.infer<typeof userClubSchema>;
export type CreateClubRequest = z.infer<typeof createClubRequestSchema>;
export type UpdateClubRequest = z.infer<typeof updateClubRequestSchema>;

export interface CreateClubResponse {
    club: ClubData;
}

export interface GetClubsResponse {
    clubs: ClubWithCountsData[];
}

export interface GetMyClubsResponse {
    clubs: UserClubData[];
}

export interface GetClubResponse {
    club: ClubData;
}

export interface UpdateClubResponse {
    club: ClubData;
}

export interface DeleteClubResponse {
    deleted: boolean;
}
