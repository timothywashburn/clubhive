import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// mongoose adds an _id property by default for each document
// it is of type ObjectId

// for pictures maybe using GridFS -- not sure but in the meantime we can probably hardcode pictures

export interface ClubData extends Document {
    name: string;
    members: ObjectId[];
    officers: ObjectId[];
    motto: string;
    description: string;
    tags: ObjectId[]; // want to use to choose from a collection of tags rather than write their own tags
    clubLogo: ObjectId;
    socialLinks: string[];
    galleryPictures: ObjectId[];
    events: ObjectId[];
    announcements: ObjectId[];
}

const ClubSchema: Schema<ClubData> = new Schema({
    name: {
        type: String,
        required: true,
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
    motto: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    tags: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Tag',
    },
    clubLogo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        // maybe can have a default picture thats stored in the database
    },
    socialLinks: {
        type: [String],
    },
    galleryPictures: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Image',
    },
    events: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Event',
    },
    announcements: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Announcement',
    },
});

const Club = mongoose.model<ClubData>('Club', ClubSchema);
export default Club;
