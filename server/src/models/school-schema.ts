import mongoose, { Document, Schema } from 'mongoose';

export interface SchoolData extends Document {
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
