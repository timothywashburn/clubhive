import mongoose, { Document, Schema, ObjectId } from 'mongoose';

export interface TagData extends Document {
    _id: ObjectId;
    type: Enumerator; // either club or event
    text: string;
}

export enum TagType {
    CLUB = 'club',
    EVENT = 'event',
}

const TagSchema: Schema<TagData> = new Schema({
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

const Tag = mongoose.model<TagData>('Tag', TagSchema);
export default Tag;
