import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface ClubSnapshotData extends Document {
    _id: ObjectId;
    date: Date;
    clubs: [
        {
            clubId: ObjectId;
            memberCount: number;
        },
    ];
    createdAt: Date;
    updatedAt: Date;
}

const ClubSnapshotSchema: Schema<ClubSnapshotData> = new Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        clubs: [
            {
                clubId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Club',
                },
                memberCount: { type: Number },
            },
        ],
    },
    { timestamps: true }
);

const ClubSnapshot = mongoose.model<ClubSnapshotData>(
    'ClubSnapshot',
    ClubSnapshotSchema
);
export default ClubSnapshot;
