import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface AnnouncementData extends Document {
    club: ObjectId; // from Club schema
    title: string;
    body: string;
    pictures: ObjectId[];
}

const AnnouncementSchema: Schema<AnnouncementData> = new Schema({
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    pictures: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'files', // idk
        required: true,
    },
});

const Announcement = mongoose.model<AnnouncementData>(
    'Announcement',
    AnnouncementSchema
);
export default Announcement;
