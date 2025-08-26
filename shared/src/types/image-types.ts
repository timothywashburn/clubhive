import { z } from 'zod';

export const imageSchema = z.object({
    _id: z.string(),
    url: z.string(),
    public_id: z.string(), // Cloudinary public ID
    uploadedBy: z.string(), // user id
    club: z.string(), // club id
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const createImageRequestSchema = z.object({
    clubId: z.string().min(1, 'Club ID is required'),
});

export const getImageRequestSchema = z.object({
    id: z.string().min(1, 'Image ID is required'),
});

export const deleteImageRequestSchema = z.object({
    id: z.string().min(1, 'Image ID is required'),
});

export type ImageData = z.infer<typeof imageSchema>;
export type CreateImageRequest = z.infer<typeof createImageRequestSchema>;
export type GetImageRequest = z.infer<typeof getImageRequestSchema>;

export interface CreateImageResponse {
    image: ImageData;
}
export interface GetImageResponse {
    image: ImageData;
}

export interface DeleteImageResponse {
    deleted: boolean;
}
