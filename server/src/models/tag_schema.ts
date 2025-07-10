import mongoose, { Document, Schema } from 'mongoose';

export interface TagData extends Document {
    type: string; // either club or event
    tag_name: string;
}

const TagSchema: Schema<TagData> = new Schema({
    type: {
        type: String,
        required: true,
    },
    tag_name: {
        type: String,
        required: true,
    },
});

const Tag = mongoose.model<TagData>('Tag', TagSchema);
export default Tag;
