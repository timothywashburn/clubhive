import { z } from 'zod';

export const schoolSchema = z.object({
    _id: z.string(),
    name: z.string().max(100),
    location: z.string().max(100),
    emailPattern: z.string().max(100),
    emailError: z.string(),
});

export const schoolWithCountsSchema = schoolSchema.extend({
    clubCount: z.number(),
    studentCount: z.number(),
});

export const createSchoolRequestSchema = z.object({
    name: z.string().max(100),
    location: z.string().max(100),
    emailPattern: z.string().max(100),
    emailError: z.string(),
});

export const updateSchoolRequestSchema = z.object({
    name: z.string().max(100).optional(),
    location: z.string().max(100).optional(),
    emailPattern: z.string().max(100).optional(),
    emailError: z.string().optional(),
});

export type SchoolData = z.infer<typeof schoolSchema>;
export type SchoolWithCountsData = z.infer<typeof schoolWithCountsSchema>;
export type CreateSchoolRequest = z.infer<typeof createSchoolRequestSchema>;
export type UpdateSchoolRequest = z.infer<typeof updateSchoolRequestSchema>;

export interface CreateSchoolResponse {
    school: SchoolData;
}

export interface GetSchoolsResponse {
    schools: SchoolWithCountsData[];
}

export interface GetSchoolResponse {
    school: SchoolWithCountsData;
}

export interface UpdateSchoolResponse {
    school: SchoolData;
}

export interface DeleteSchoolResponse {
    deleted: boolean;
}
