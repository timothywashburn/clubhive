import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// mongoose adds an _id property by default for each document
// it is of type ObjectId

// for pictures maybe using GridFS -- not sure but in the meantime we can probably hardcode pictures

// not finished

export interface EventData extends Document {
    name: string;
    tags: ObjectId[]; // want to use to choose from a collection of tags rather than write their own tags
    date: Date;
    start_time: string;
    end_time: string;
    location_name: string;
    location_address: string;
    club: ObjectId;
    picture: ObjectId;
    description: string;
    event_type: string;
    location_description: string;
    requirements: string;
}

const EventSchema: Schema<EventData> = new Schema({
    name: {
        type: String,
        required: true,
    },
    tags: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Tag',
        required: true,
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
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true,
    },
    picture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
    },
    description: {
        type: String,
        default: '',
    },
    event_type: {
        type: String,
        default: 'N/A',
    },
    location_description: {
        type: String,
        default: 'N/A',
    },
    requirements: {
        type: String,
        default: 'none',
    },
});

const Event = mongoose.model<EventData>('Event', EventSchema);
export default Event;
