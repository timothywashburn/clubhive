import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// mongoose adds an _id property by default for each document
// it is of type ObjectId

// for pictures maybe using GridFS -- not sure but in the meantime we can probably hardcode pictures

export interface EventData extends Document {
    name: string;
    tags: ObjectId[]; // want to use to choose from a collection of tags rather than write their own tags
    date: Date;
    startTime: string;
    endTime: string;
    locationName: string;
    locationAddress: string;
    club: ObjectId;
    picture: ObjectId;
    description: string;
    eventType: string;
    locationDescription: string;
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
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    locationName: {
        type: String,
        required: true,
    },
    locationAddress: {
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
    eventType: {
        type: String,
        default: 'N/A',
    },
    locationDescription: {
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
