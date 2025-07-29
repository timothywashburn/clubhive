import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';

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
        },
        clubs: [
            {
                clubId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Club',
                    required: true,
                },
                memberCount: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

export type ClubSnapshotSchema = InferSchemaType<typeof schema>;
export type ClubSnapshotDoc = HydratedDocument<InferSchemaType<typeof schema>>;

const ClubSnapshot = mongoose.model('ClubSnapshot', schema);
export default ClubSnapshot;
