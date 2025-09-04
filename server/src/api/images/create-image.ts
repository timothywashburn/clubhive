// server/src/api/images/upload-image-endpoint.ts
import { CreateImageRequest, CreateImageResponse, createImageRequestSchema, imageSchema } from '@clubhive/shared';
import ImageController from '@/controllers/image-controller';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import { getUploadHandler } from '@/utils/cloudinary-multer';
import { serializeRecursive } from '@/utils/db-doc-utils';
import { z } from 'zod';
import multer from 'multer';

export const uploadImageEndpoint: ApiEndpoint<CreateImageRequest, CreateImageResponse> = {
    path: '/api/images',
    method: 'post',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        // Use multer middleware for file upload
        const upload = await getUploadHandler();
        upload.single('image')(req, res, async err => {
            try {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({
                        success: false,
                        error: {
                            message: err.code === 'LIMIT_FILE_SIZE' ? 'File too large' : 'Upload error',
                        },
                    });
                }

                if (err) {
                    return res.status(400).json({
                        success: false,
                        error: {
                            message: 'Upload failed',
                        },
                    });
                }

                if (!req.file) {
                    return res.status(400).json({
                        success: false,
                        error: {
                            message: 'No file uploaded',
                        },
                    });
                }

                // Validate request body
                const data = createImageRequestSchema.parse(req.body);

                const newImage = await ImageController.createImage({
                    url: req.file.path, // Cloudinary URL
                    public_id: req.file.filename, // Cloudinary public ID
                    uploadedBy: req.auth!.userId,
                    club: data.clubId,
                });

                res.json({
                    success: true,
                    image: imageSchema.parse(serializeRecursive(newImage)),
                });
            } catch (error) {
                let message = 'Error uploading image';

                if (error instanceof z.ZodError) {
                    message = error.issues[0].message;
                } else if (error instanceof Error) {
                    message = error.message;
                } else {
                    message = JSON.stringify(error);
                }

                res.status(400).json({
                    success: false,
                    error: { message },
                });
            }
        });
    },
};
