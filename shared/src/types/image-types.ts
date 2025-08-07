import { z } from 'zod';

export const imageSchema = z.object({
    _id: z.string(),
    url: z.string(),
    uploadedBy: z.string(), // user id
    club: z.string(), // club id
    type: z.enum(['profile', 'gallery']), // choose pfp or gallery picture
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const createImageRequestSchema = z.object({
    clubId: z.string().min(1, 'Club ID is required'),
    type: z.enum(['profile', 'gallery']),
});

export const getImagesRequestSchema = z.object({
    clubId: z.string().optional(),
    type: z.enum(['profile', 'gallery']).optional(),
    limit: z.number().min(1).max(100).default(20),
    page: z.number().min(1).default(1),
});

export type ImageData = z.infer<typeof imageSchema>;
export type CreateImageRequest = z.infer<typeof createImageRequestSchema>;
export type GetImagesRequest = z.infer<typeof getImagesRequestSchema>;

export interface CreateImageResponse {
    image: ImageData;
}

export interface GetImagesResponse {
    images: ImageData[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
}

export interface GetImageResponse {
    image: ImageData;
}

export interface DeleteImageResponse {
    deleted: boolean;
}
