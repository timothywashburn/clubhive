import { GetSchoolsResponse, schoolWithCountsSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import SchoolController from '@/controllers/school-controller';
import { serializeRecursive } from '@/utils/db-doc-utils';

export const getSchoolsEndpoint: ApiEndpoint<undefined, GetSchoolsResponse> = {
    path: '/api/schools',
    method: 'get',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            const schools = await SchoolController.getAllSchools();

            res.json({
                success: true,
                schools: schools.map(school => schoolWithCountsSchema.parse(serializeRecursive(school))),
            });
        } catch (error) {
            console.error('Error fetching schools:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error fetching schools',
                },
            });
        }
    },
};
