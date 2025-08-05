import { UpdateSchoolRequest, UpdateSchoolResponse, updateSchoolRequestSchema, schoolSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import SchoolController from '@/controllers/school-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';
import { z } from 'zod';

export const updateSchoolEndpoint: ApiEndpoint<UpdateSchoolRequest, UpdateSchoolResponse> = {
    path: '/api/schools/:id',
    method: 'put',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const schoolId = req.params.id;
            const updates = updateSchoolRequestSchema.parse(req.body);
            const school = await SchoolController.updateSchool(schoolId, updates);

            if (!school) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'School not found',
                    },
                });
                return;
            }

            res.json({
                success: true,
                school: schoolSchema.parse(serializeRecursive(school)),
            });
        } catch (error) {
            let message = 'Error updating school';
            if (error instanceof z.ZodError) {
                message = error.issues[0].message;
            }
            console.error('Error updating school:', error);
            res.status(400).json({
                success: false,
                error: {
                    message,
                },
            });
        }
    },
};
