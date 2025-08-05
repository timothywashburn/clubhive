import { GetSchoolResponse, schoolWithCountsSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import SchoolController from '@/controllers/school-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';

export const getSchoolEndpoint: ApiEndpoint<undefined, GetSchoolResponse> = {
    path: '/api/schools/:id',
    method: 'get',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            const { id } = req.params;

            const school = await SchoolController.getSchoolById(id);

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
                school: schoolWithCountsSchema.parse(serializeRecursive(school)),
            });
        } catch (error) {
            console.error('Error fetching school:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error fetching school',
                },
            });
        }
    },
};
