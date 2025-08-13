import { v2 as cloudinary } from 'cloudinary';

export const deleteImageFromCloudinary = async (public_id: string) => {
    try {
        const res = await cloudinary.uploader.destroy(public_id);
        return res;
    } catch (err) {
        throw new Error('Failed to delete image');
    }
};
