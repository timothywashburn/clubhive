import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';
import { ClubRole } from '@clubhive/shared/src/types/club-membership-types';

// mongoose adds an _id property by default for each document
// it is of type ObjectId

export interface ClubMembershipData extends Document {
    _id: string;
    userId: string;
    clubId: string;
    role: ClubRole;
    createdAt: Date;
    updatedAt: Date;
}

export enum ClubRole {
    OWNER = 'owner',
    MEMBER = 'member',
    OFFICER = 'officer',
    PRINCIPAL_MEMBER = 'principal_member',
}

const ClubMembershipSchema: Schema<ClubMembershipData> = new Schema(
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

const ClubMembership = mongoose.model<ClubMembershipData>('ClubMembership', ClubMembershipSchema);
export default ClubMembership;
