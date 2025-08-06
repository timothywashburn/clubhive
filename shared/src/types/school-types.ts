import { z } from 'zod';

export const schoolSchema = z.object({
    _id: z.string(),
    name: z.string(),
    location: z.string(),
});

export const schoolWithCountsSchema = schoolSchema.extend({
    clubCount: z.number(),
    studentCount: z.number(),
});

export const createSchoolRequestSchema = z.object({
    name: z.string(),
    location: z.string(),
});

export const updateSchoolRequestSchema = z.object({
    name: z.string().optional(),
    location: z.string().optional(),
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
