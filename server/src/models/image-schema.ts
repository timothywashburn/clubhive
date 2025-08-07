import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';

const schema = new Schema(
    {
        url: {
            type: String,
            required: true, // Cloudinary URL
        },
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        club: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Club',
            required: true,
        },
        type: {
            type: String,
            enum: ['profile', 'gallery'],
            required: true,
        },
    },
    { timestamps: true }
);

export type ImageSchema = InferSchemaType<typeof schema>;
export type ImageDoc = HydratedDocument<ImageSchema>;

const CloudinaryImage = mongoose.model('CloudinaryImage', schema);
export default CloudinaryImage;
