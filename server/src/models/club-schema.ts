import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';
import { ClubStatus } from '@clubhive/shared/src';

const schema = new Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        school: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
        },
        name: {
            type: String,
            required: true,
        },
        tagline: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        url: {
            type: String,
        },
        joinRequirements: {
            type: String,
        },
        status: {
            type: String,
            enum: Object.values(ClubStatus),
            required: true,
        },
        socials: {
            website: {
                type: String,
            },
            discord: {
                type: String,
            },
            instagram: {
                type: String,
            },
        },
        clubLogo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image',
        },
        pictures: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Image',
        },
        tags: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Tag',
        },
    },
    { timestamps: true }
);

export type ClubSchema = InferSchemaType<typeof schema>;
export type ClubDoc = HydratedDocument<InferSchemaType<typeof schema>>;

const Club = mongoose.model('Club', schema);
export default Club;
