import { DeleteSchoolResponse } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import SchoolController from '@/controllers/school-controller';

export const deleteSchoolEndpoint: ApiEndpoint<undefined, DeleteSchoolResponse> = {
    path: '/api/schools/:id',
    method: 'delete',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const schoolId = req.params.id;
            const deleted = await SchoolController.deleteSchool(schoolId);

            if (!deleted) {
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
                deleted: true,
            });
        } catch (error) {
            console.error('Error deleting school:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error deleting school',
                },
            });
        }
    },
};
