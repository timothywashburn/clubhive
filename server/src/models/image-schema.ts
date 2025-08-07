import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';

const schema = new Schema(
    {
        url: {
            type: String,
            required: true, // Cloudinary URL
        },
        public_id: {
            type: String,
            required: true,
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        club: {
            type: Schema.Types.ObjectId,
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
