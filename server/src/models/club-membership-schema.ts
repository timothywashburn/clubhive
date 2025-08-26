import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { ClubRole } from '@clubhive/shared';

export interface ClubMembershipData extends Document {
    _id: ObjectId;
    user: ObjectId;
    club: ObjectId;
    role: ClubRole;
    createdAt: Date;
    updatedAt: Date;
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
