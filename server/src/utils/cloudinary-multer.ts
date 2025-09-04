import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { ConfigManager } from '@/services/config-manager';

let multerInstance: multer.Multer | null = null;

export async function getUploadHandler(): Promise<multer.Multer> {
    if (!multerInstance) {
        const config = await ConfigManager.getConfig();

        cloudinary.config({
            cloud_name: config.cloudinary.cloudName,
            api_key: config.cloudinary.apiKey,
            api_secret: config.cloudinary.apiSecret,
        });

        const storage = new CloudinaryStorage({
            cloudinary,
            params: async (req, file) => ({
                folder: 'clubhive',
                allowed_formats: ['jpg', 'png', 'jpeg'],
                public_id: `${Date.now()}-${file.originalname}`,
                transformation: [{ width: 1000, crop: 'limit' }],
            }),
        });

        multerInstance = multer({
            storage,
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        });
    }

    return multerInstance;
}
