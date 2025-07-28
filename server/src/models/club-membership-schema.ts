import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';

export enum ClubRole {
    OWNER = 'owner',
    MEMBER = 'member',
    OFFICER = 'officer',
    PRINCIPAL_MEMBER = 'principal_member',
}

const schema = new Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        club: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Club',
            required: true,
        },
        role: {
            type: String,
            enum: Object.values(ClubRole),
            required: true,
        },
    },
    { timestamps: true }
);

export type ClubMembershipSchema = InferSchemaType<typeof schema>;
export type ClubMembershipDoc = HydratedDocument<InferSchemaType<typeof schema>>;

const ClubMembership = mongoose.model('ClubMembership', schema);
export default ClubMembership;
