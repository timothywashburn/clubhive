import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface ClubSnapshotData {
    clubId: mongoose.Types.ObjectId;
    memberCount: number;
    newMembersToday: number;
    leavingMembersToday: number;
    eventSavesToday: number;
    majorDistribution: { major: string; count: number }[];
}

export interface ClubSnapshotDocument extends Document {
    _id: mongoose.Types.ObjectId;
    date: Date;
    clubs: ClubSnapshotData[];
    createdAt: Date;
    updatedAt: Date;
}

const ClubSnapshotClubStatsSchema: Schema = new Schema(
    {
        clubId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Club',
            required: true,
        },
        memberCount: {
            type: Number,
            required: true,
            default: 0,
        },
        newMembersToday: {
            type: Number,
            required: true,
            default: 0,
        },
        leavingMembersToday: {
            type: Number,
            required: true,
            default: 0,
        },
        eventSavesToday: {
            type: Number,
            required: true,
            default: 0,
        },
        majorDistribution: [
            {
                major: { type: String, required: true },
                count: { type: Number, required: true },
            },
        ],
    },
    { _id: false }
);

const ClubSnapshotSchema: Schema<ClubSnapshotDocument> = new Schema(
    {
        date: {
            type: Date,
            required: true,
            unique: true, // so that we take only one snapshot per day
            index: true,
        },
        clubs: [ClubSnapshotClubStatsSchema],
    },
    { timestamps: true, collection: 'club_snapshot' }
);

const ClubSnapshot = mongoose.model<ClubSnapshotDocument>('ClubSnapshot', ClubSnapshotSchema);
export default ClubSnapshot;
