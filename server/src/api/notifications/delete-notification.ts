import { ApiEndpoint, AuthType } from '@/types/api-types';
import { DeleteNotificationResponse } from '@clubhive/shared';
import Notification from '@/models/notification-schema';
import UserNotification from '@/models/user-notification-schema';
import ImageController from '@/controllers/image-controller';
import { deleteImageFromCloudinary } from '@/services/imageService';
import { ImageData } from '@clubhive/shared';

export const deleteNotificationEndpoint: ApiEndpoint<undefined, DeleteNotificationResponse> = {
    path: '/api/notifications/:id',
    method: 'delete',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const id = req.params.id;

            const notification = await Notification.findById(id).populate('pictures');

            if (!notification) {
                res.status(404).json({ success: false, error: { message: 'Notification not found' } });
                return;
            }

            // deleting pictures
            if (notification.pictures && notification.pictures.length > 0) {
                for (const image of notification.pictures) {
                    try {
                        const imageData = image as unknown as ImageData;

                        // Delete from Cloudinary
                        await deleteImageFromCloudinary(imageData.public_id);

                        // Delete from database
                        await ImageController.deleteImage(imageData._id);
                    } catch (err) {
                        console.error('Error deleting image:', err);
                    }
                }
            }

            const deleted = await Notification.findByIdAndDelete(id);
            if (!deleted) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Notification not found',
                    },
                });
                return;
            }

            await UserNotification.deleteMany({ notification: id });

            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting notification:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error deleting notification',
                },
            });
        }
    },
};
