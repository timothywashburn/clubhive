import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';

const ClubStatsSchema = new Schema(
    {
        clubId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Club',
            required: true,
        },
        memberCount: { type: Number, required: true, default: 0 },
        newMembersToday: { type: Number, required: true, default: 0 },
        leavingMembersToday: { type: Number, required: true, default: 0 },
        eventSavesToday: { type: Number, required: true, default: 0 },
        majorDistribution: [
            {
                major: { type: String, required: true },
                count: { type: Number, required: true },
            },
        ],
    },
    { _id: false }
);

const schema = new Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        date: {
            type: Date,
            required: true,
            unique: true,
            index: true,
        },
        clubs: [ClubStatsSchema],
    },
    { timestamps: true, collection: 'club_snapshot' }
);

export type ClubSnapshotData = InferSchemaType<typeof ClubStatsSchema>;
export type ClubSnapshotDocument = HydratedDocument<InferSchemaType<typeof schema>>;

export type ClubSnapshotSchema = InferSchemaType<typeof schema>;
export type ClubSnapshotDoc = HydratedDocument<ClubSnapshotSchema>;

const ClubSnapshot = mongoose.model('ClubSnapshot', schema);
export default ClubSnapshot;
