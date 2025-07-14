import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// mongoose adds an _id property by default for each document
// it is of type ObjectId

export interface EventData extends Document {
    _id: ObjectId;
    club: ObjectId;
    name: string;
    description: string;
    type: EventType;
    location: string;
    date: string;
    startTime: string;
    endTime: string;
    picture: ObjectId;
    tags: ObjectId[]; // want to use to choose from a collection of tags rather than write their own tags
}

export enum EventType {
    CLUB_OFFICERS = 'Club Officers',
    CLUB_MEMBERS = 'Club Members',
    UCSD_STUDENTS = 'UCSD Students',
    ANYONE = 'Anyone',
}

const EventSchema: Schema<EventData> = new Schema({
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        enum: Object.values(EventType),
    },
    location: {
        type: String,
        required: true,
    },
    date: {
        type: String,
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
    picture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
    },
    tags: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Tag',
        required: true,
    },
});

const Event = mongoose.model<EventData>('Event', EventSchema);
export default Event;
