import { z } from 'zod';
import { schoolSchema } from './school-types';

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
    name: z.string(),
    school: schoolSchema,
    major: z.string(),
    educationType: z.enum([EducationType.UNDERGRADUATE, EducationType.GRADUATE]),
    year: z.enum([Year.FIRST, Year.SECOND, Year.THIRD, Year.FOURTH, Year.OVER_FOUR]),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type UserData = z.infer<typeof userSchema>;
