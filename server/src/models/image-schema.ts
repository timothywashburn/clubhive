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
            auto: true,
        },
        public_id: {
            // Cloudinary public ID
            type: String,
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
    },
    { timestamps: true }
);

export type ImageSchema = InferSchemaType<typeof schema>;
export type ImageDoc = HydratedDocument<ImageSchema>;

const Image = mongoose.model('Image', schema);
export default Image;
