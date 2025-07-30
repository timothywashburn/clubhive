import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';

const schema = new Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        imgData: {
            type: Buffer,
            required: true,
        },
        contentType: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

export type ImageSchema = InferSchemaType<typeof schema>;
export type ImageDoc = HydratedDocument<InferSchemaType<typeof schema>>;

const Image = mongoose.model('Image', schema);
export default Image;
