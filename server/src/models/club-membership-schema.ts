import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// mongoose adds an _id property by default for each document
// it is of type ObjectId

export interface ClubMembershipData extends Document {
    _id: ObjectId;
    user: ObjectId;
    club: ObjectId;
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
            enum: Object.values(ClubRole), // can be edited as needed
            required: true,
        },
    },
    { timestamps: true }
);

const ClubMembership = mongoose.model<ClubMembershipData>('ClubMembership', ClubMembershipSchema);
export default ClubMembership;
