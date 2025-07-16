import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface SavedEventsData extends Document {
    _id: ObjectId;
    userId: ObjectId;
    eventId: ObjectId;
    savedAt: Date;
}

const SavedEventsSchema: Schema<SavedEventsData> = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        savedAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

const SavedEvents = mongoose.model<SavedEventsData>(
    'SavedEvents',
    SavedEventsSchema
);
export default SavedEvents;
