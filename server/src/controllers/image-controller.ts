import Image from '@/models/image-schema';

class ImageController {
    static async getImageById(id: string) {
        return await Image.findById(id);
    }

    static async getImagesByClub(clubId: string) {
        return await Image.find({ club: clubId });
    }

    static async createImage(data: any) {
        const image = new Image(data);
        return await image.save();
    }

    static async deleteImage(id: string) {
        return await Image.findByIdAndDelete(id);
    }
}

export default ImageController;
