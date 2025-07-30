import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';

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
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
        savedAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

export type SavedEventsSchema = InferSchemaType<typeof schema>;
export type SavedEventsDoc = HydratedDocument<InferSchemaType<typeof schema>>;

const SavedEvents = mongoose.model('SavedEvents', schema);
export default SavedEvents;
