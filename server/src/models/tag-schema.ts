import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';

export enum TagType {
    CLUB = 'club',
    EVENT = 'event',
}

const schema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    type: {
        type: String,
        enum: Object.values(TagType),
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
});

export type TagSchema = InferSchemaType<typeof schema>;
export type TagDoc = HydratedDocument<InferSchemaType<typeof schema>>;

const Tag = mongoose.model('Tag', schema);
export default Tag;
