import mongoose, { Schema, Document, ObjectId } from 'mongoose';
// con to this method of storing images: storing large images
// directly can lead to performance issues and scalability problems over time
export interface ImageData extends Document {
    _id: ObjectId;
    imgData: Buffer;
    contentType: string; // storing type (eg. .jpeg, .png)
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ImageSchema: Schema<ImageData> = new Schema(
    {
        imgData: {
            type: Buffer,
            contentType: String,
        },
        contentType: {
            type: String,
        },
        expiresAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

const Image = mongoose.model<ImageData>('Image', ImageSchema);
export default Image;
