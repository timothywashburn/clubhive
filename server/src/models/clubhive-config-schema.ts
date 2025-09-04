import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';

const schema = new Schema(
    {
        emsApi: {
            type: {
                host: {
                    type: String,
                    required: true,
                },
                token: {
                    type: String,
                    required: true,
                },
            },
            required: true,
        },
        jwtSecret: {
            type: String,
            required: true,
        },
        cloudinary: {
            type: {
                cloudName: {
                    type: String,
                    required: true,
                },
                apiKey: {
                    type: String,
                    required: true,
                },
                apiSecret: {
                    type: String,
                    required: true,
                },
            },
            required: true,
        },
    },
    { timestamps: true }
);

export type ClubhiveConfigSchema = InferSchemaType<typeof schema>;
export type ClubhiveConfigDoc = HydratedDocument<InferSchemaType<typeof schema>>;

export const ClubhiveConfigModel = mongoose.model('ClubhiveConfig', schema);
