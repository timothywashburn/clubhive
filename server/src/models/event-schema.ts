import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';
import { EventType } from '@clubhive/shared';

const schema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
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
        required: true,
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
    published: {
        type: Boolean,
        default: false,
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

export type EventSchema = InferSchemaType<typeof schema>;
export type EventDoc = HydratedDocument<InferSchemaType<typeof schema>>;

const Event = mongoose.model('Event', schema);
export default Event;
