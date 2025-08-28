import { z } from 'zod';
import { schoolSchema } from './school-types.js';

export enum EducationType {
    UNDERGRADUATE = 'Undergraduate',
    GRADUATE = 'Graduate',
}

export enum Year {
    FIRST = '1',
    SECOND = '2',
    THIRD = '3',
    FOURTH = '4',
    OVER_FOUR = '>4',
}

export const userSchema = z.object({
    _id: z.string(),
    name: z.string().max(50),
    school: schoolSchema,
    major: z.string(),
    educationType: z.enum([EducationType.UNDERGRADUATE, EducationType.GRADUATE]),
    year: z.enum([Year.FIRST, Year.SECOND, Year.THIRD, Year.FOURTH, Year.OVER_FOUR]),
    admin: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const userWithCountsSchema = userSchema.extend({
    clubsCount: z.number(),
});

export const deleteUserResponseSchema = z.object({
    deleted: z.boolean(),
});

export const updateUserResponseSchema = z.object({
    updated: z.boolean(),
});

export const updateUserRequestSchema = z.object({
    name: z.string().optional(),
    school: z.string().optional(),
    major: z.string().optional(),
    educationType: z.enum([EducationType.UNDERGRADUATE, EducationType.GRADUATE]).optional(),
    year: z.enum([Year.FIRST, Year.SECOND, Year.THIRD, Year.FOURTH, Year.OVER_FOUR]).optional(),
});

export type UserData = z.infer<typeof userSchema>;
export type UserWithCountsData = z.infer<typeof userWithCountsSchema>;
export type DeleteUserResponse = z.infer<typeof deleteUserResponseSchema>;

export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>;
export type UpdateUserResponse = z.infer<typeof updateUserResponseSchema>;

export interface GetUsersResponse {
    users: UserWithCountsData[];
}

export interface GetUserResponse {
    user: UserWithCountsData;
}
