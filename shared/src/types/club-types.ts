import { z } from 'zod';

export const tagSchema = z.object({
    _id: z.string(),
    type: z.enum(['club', 'event']),
    text: z.string(),
});

export const schoolSchema = z.object({
    _id: z.string(),
    name: z.string(),
    location: z.string(),
});

export const clubSchema = z.object({
    _id: z.string(),
    school: schoolSchema,
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    url: z.string(),
    socials: z.object({
        website: z.string(),
        discord: z.string(),
        instagram: z.string(),
    }),
    clubLogo: z.string().nullable().optional(),
    pictures: z.array(z.string()),
    tags: z.array(tagSchema),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const createClubRequestSchema = z.object({
    school: z.string(),
    name: z.string(),
    tagline: z.string(),
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

export type TagData = z.infer<typeof tagSchema>;
export type SchoolData = z.infer<typeof schoolSchema>;
export type ClubData = z.infer<typeof clubSchema>;
export type CreateClubRequest = z.infer<typeof createClubRequestSchema>;
export type UpdateClubRequest = z.infer<typeof updateClubRequestSchema>;

export interface CreateClubResponse {
    club: ClubData;
}

export interface GetClubsResponse {
    clubs: ClubData[];
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
