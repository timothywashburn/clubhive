import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface SavedEventsData extends Document {
    user_id: ObjectId;
    event_id: ObjectId;
    saved_at: Date;
}

const SavedEventsSchema: Schema<SavedEventsData> = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    saved_at: {
        type: Date,
        required: true,
    },
});

const SavedEvents = mongoose.model<SavedEventsData>(
    'SavedEvents',
    SavedEventsSchema
);
export default SavedEvents;
