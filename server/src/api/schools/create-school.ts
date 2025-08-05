import { CreateSchoolRequest, CreateSchoolResponse, createSchoolRequestSchema, schoolSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import SchoolController from '@/controllers/school-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';
import { z } from 'zod';

export const createSchoolEndpoint: ApiEndpoint<CreateSchoolRequest, CreateSchoolResponse> = {
    path: '/api/schools',
    method: 'post',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const data = createSchoolRequestSchema.parse(req.body);
            const school = await SchoolController.createSchool(data);

            res.json({
                success: true,
                school: schoolSchema.parse(serializeRecursive(school)),
            });
        } catch (error) {
            let message = 'Error creating school';
            if (error instanceof z.ZodError) {
                message = error.issues[0].message;
            }
            console.error('Error creating school:', error);
            res.status(400).json({
                success: false,
                error: {
                    message,
                },
            });
        }
    },
};
