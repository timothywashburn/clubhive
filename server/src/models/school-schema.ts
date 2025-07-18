import mongoose, { Document, Schema, ObjectId } from 'mongoose';

export interface SchoolData extends Document {
    _id: ObjectId;
    name: string;
    location: string;
}

const SchoolSchema: Schema<SchoolData> = new Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
});

const School = mongoose.model<SchoolData>('School', SchoolSchema);
export default School;
