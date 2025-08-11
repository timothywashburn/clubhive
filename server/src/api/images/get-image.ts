import { GetImageResponse, getImageRequestSchema, imageSchema } from '@clubhive/shared';
import ImageController from '@/controllers/image-controller';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import { serializeRecursive } from '@/utils/db-doc-utils';

export const getImagesEndpoint: ApiEndpoint<undefined, GetImageResponse> = {
    path: 'api/images/:id',
    method: 'get',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            const queryData = getImageRequestSchema.safeParse(req.query);

            if (!queryData.success) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid query parameters',
                    },
                });
                return;
            }

            const { id } = queryData.data;
            const image = await ImageController.getImageById(id);

            if (!image) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Image not found',
                    },
                });
            }

            res.json({
                success: true,
                image: imageSchema.parse(serializeRecursive(image)),
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error getting image',
                },
            });
        }
    },
};
