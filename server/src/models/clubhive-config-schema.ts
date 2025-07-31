import mongoose from 'mongoose';

const clubhiveConfigSchema = new mongoose.Schema(
    {
        emsApiBaseUrl: {
            type: String,
            required: true,
        },
        emsApiToken: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const ClubhiveConfigModel = mongoose.model('ClubhiveConfig', clubhiveConfigSchema);
