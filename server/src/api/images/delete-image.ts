import { DeleteImageResponse, deleteImageRequestSchema } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import ImageController from '@/controllers/image-controller';
import { deleteImageFromCloudinary } from '@/services/imageService';

export const deleteImageEndpoint: ApiEndpoint<undefined, DeleteImageResponse> = {
    path: '/api/images/:imageId',
    method: 'delete',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const { imageId } = req.params;

            // Find the image in database
            const image = await ImageController.getImageById(imageId);

            if (!image) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Image not found',
                    },
                });
                return;
            }

            // Check if user requesting to delete is the one who uploaded it
            // note: we should also allow Admins to delete
            if (image.uploadedBy.toString() !== req.auth!.userId) {
                res.status(403).json({
                    success: false,
                    error: {
                        message: 'Not authorized to delete this image',
                    },
                });
            }

            // Extract public_id from Cloudinary URL
            const urlParts = image.url.split('/');
            const fileWithExtension = urlParts[urlParts.length - 1];
            const public_id = `clubhive/${fileWithExtension.split('.')[0]}`;

            // Delete from Cloudinary
            await deleteImageFromCloudinary(public_id);

            // Delete from database
            await ImageController.deleteImage(imageId);

            res.json({
                success: true,
                deleted: true,
            });
        } catch (error) {
            console.error('Error deleting image:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error deleting image',
                },
            });
        }
    },
};
