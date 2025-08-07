import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

export const uploadImageToCloudinary = async (filePath: string): Promise<UploadApiResponse> => {
    try {
        const res = await cloudinary.uploader.upload(filePath);
        return res;
    } catch (err) {
        throw new Error('Failed to upload image');
    }
};

export const deleteImageFromCloudinary = async (public_id: string) => {
    try {
        const res = await cloudinary.uploader.destroy(public_id);
        return res;
    } catch (err) {
        throw new Error('Failed to delete image');
    }
};
