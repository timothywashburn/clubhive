import { z } from 'zod';
import { ClubRole } from './club-membership-types.js';
import { schoolSchema } from './school-types.js';
import { tagSchema } from './tag-types.js';
import { eventSchema } from './event-types.js';

export enum ClubStatus {
    ANYONE_CAN_JOIN = 'Anyone can join',
    REQUEST_TO_JOIN = 'Request to join',
    CLOSED = 'Closed',
}

export const clubSchema = z.object({
    _id: z.string(),
    school: schoolSchema,
    name: z.string().max(50),
    tagline: z.string().max(50).optional(),
    description: z.string().max(1000).optional(),
    url: z.string().max(50),
    joinRequirements: z.string().max(1000).optional(),
    status: z.enum(ClubStatus),
    socials: z
        .object({
            website: z.string().max(100).optional(),
            discord: z.string().max(100).optional(),
            instagram: z.string().max(100).optional(),
        })
        .optional(),
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

export const clubWithEventsAndCountsSchema = clubSchema.extend({
    upcomingEvents: z.array(eventSchema).default([]),
    pastEvents: z.array(eventSchema).default([]),
    memberCount: z.number().default(0),
    eventCount: z.number().default(0),
});

export const createClubRequestSchema = z.object({
    school: z.string().min(1, 'School is required'),
    name: z.string().min(1, 'Club name is required').max(50, 'Club name must be 50 characters or less'),
    tagline: z.string().min(1, 'Tagline is required').max(50, 'Tagline must be 50 characters or less').optional(),
    description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
    url: z
        .string()
        .min(1, 'URL is required')
        .regex(/^[a-zA-Z0-9_-]+$/, 'URL can only contain letters, numbers, hyphens, and underscores')
        .max(50, 'URL must be 50 characters or less'),
    // will be optional later
    joinRequirements: z.string().max(1000).optional(),
    status: z.enum(ClubStatus),
    socials: z
        .object({
            website: z
                .string()
                .max(100)
                .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]*)?$/, 'Invalid website URL format')
                .transform(s => (s ? `https://${s}` : undefined))
                .optional(),
            discord: z
                .string()
                .max(100)
                .regex(/^[a-zA-Z0-9_-]+$/, 'Discord invite can only contain letters, numbers, hyphens, and underscores')
                .transform(s => (s ? `https://discord.com/invite/${s}` : undefined))
                .optional(),
            instagram: z
                .string()
                .max(100)
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
    name: z.string().max(50, 'Club name must be 50 characters or less').optional(),
    tagline: z.string().max(50, 'Tagline must be 50 characters or less').optional(),
    description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
    url: z
        .string()
        .regex(/^[a-zA-Z0-9_-]+$/, 'URL can only contain letters, numbers, hyphens, and underscores')
        .max(50, 'URL must be 50 characters or less')
        .optional(),
    joinRequirements: z.string().max(1000).optional(),
    status: z.enum(ClubStatus).optional(),
    socials: z
        .object({
            website: z
                .string()
                .max(100)
                .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]*)?$/, 'Invalid website URL format')
                .transform(s => (s ? `https://${s}` : undefined))
                .optional(),
            discord: z
                .string()
                .max(100)
                .regex(/^[a-zA-Z0-9_-]+$/, 'Discord invite can only contain letters, numbers, hyphens, and underscores')
                .transform(s => (s ? `https://discord.com/invite/${s}` : undefined))
                .optional(),
            instagram: z
                .string()
                .max(100)
                .regex(/^[a-zA-Z0-9_.]+$/, 'Instagram username can only contain letters, numbers, periods, and underscores')
                .transform(s => (s ? `https://www.instagram.com/${s}` : undefined))
                .optional(),
        })
        .optional(),
    clubLogo: z.string().optional(),
    pictures: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
});

export const userClubSchema = clubSchema.extend({
    userRole: z.enum(ClubRole),
});

export const clubMemberSchema = z.object({
    user: z.object({
        _id: z.string(),
        name: z.string(),
        year: z.string(),
        major: z.string(),
    }),
    userRole: z.enum(ClubRole),
});

export type ClubData = z.infer<typeof clubSchema>;
export type ClubWithCountsData = z.infer<typeof clubWithCountsSchema>;
export type ClubWithEventsData = z.infer<typeof clubWithEventsAndCountsSchema>;
export type UserClubData = z.infer<typeof userClubSchema>;
export type ClubMemberData = z.infer<typeof clubMemberSchema>;
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
    club: ClubWithEventsData;
}

export interface UpdateClubResponse {
    club: ClubData;
}

export interface DeleteClubResponse {
    deleted: boolean;
}

export interface GetClubMembersResponse {
    members: ClubMemberData[];
}

export interface UserClubDataResponse {
    message?: string;
}
