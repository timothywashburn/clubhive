import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// mongoose adds an _id property by default for each document
// it is of type ObjectId

// for pictures maybe using GridFS -- not sure but in the meantime we can probably hardcode pictures

// not finished

export interface EventData extends Document {
    name: string;
    picture: ObjectId;
    description: string;
    tags: string[]; // want to use to choose from a collection of tags rather than write their own tags
    event_type: string;
    date: Date;
    start_time: string;
    end_time: string;
    location_name: string;
    location_address: string;
    location_description: string;
    club: ObjectId;
    requirements: string;
}

const EventSchema: Schema<EventData> = new Schema({
    name: {
        type: String,
        required: true,
    },
    picture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'file',
    },
    description: {
        type: String,
        default: '',
    },
    tags: {
        type: [String],
        required: true,
    },
    event_type: {
        type: String,
        default: 'N/A',
    },
    date: {
        type: Date,
        required: true,
    },
    start_time: {
        type: String,
        required: true,
    },
    end_time: {
        type: String,
        required: true,
    },
    location_name: {
        type: String,
        required: true,
    },
    location_address: {
        type: String,
        required: true,
    },
    location_description: {
        type: String,
        default: 'N/A',
    },
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
    },
    requirements: {
        type: String,
        default: 'none',
    },
});

const Event = mongoose.model<EventData>('Event', EventSchema);
export default Event;
