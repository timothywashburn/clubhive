import mongoose, { Schema, Document, ObjectId } from 'mongoose';
// con to this method of storing images: storing large images
// directly can lead to performance issues and scalability problems over time
export interface ImageData extends Document {
    imgData: Buffer;
    contentType: string; // storing type (eg. .jpeg, .png)
}

const ImageSchema: Schema<ImageData> = new Schema({
    imgData: {
        type: Buffer,
        contentType: String,
    },
    contentType: {
        type: String,
    },
});

const Image = mongoose.model<ImageData>('Image', ImageSchema);
export default Image;
