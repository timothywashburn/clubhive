import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// mongoose adds an _id property by default for each document
// it is of type ObjectId

// for pictures maybe using GridFS -- not sure but in the meantime we can probably hardcode pictures

export interface IClub extends Document {
    name: string;
    description: string;
    events: ObjectId[];
    announcements: ObjectId[];
    tags: string[];
    social_links: string[];
    members: ObjectId[];
    officers: ObjectId[];
    club_pfp: ObjectId;
    gallery_pictures: ObjectId[];
}

const ClubSchema: Schema<IClub> = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    events: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Event',
    },
    announcements: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Announcement',
    },
    tags: {
        type: [String],
        required: true,
    },
    social_links: {
        type: [String],
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true,
    },
    officers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true,
    },
    club_pfp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'file',
        // maybe can have a default picture thats stored in the database
    },
    gallery_pictures: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'file',
    },
});

const Club = mongoose.model<IClub>('Club', ClubSchema);
export default Club;
