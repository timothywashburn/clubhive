import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// mongoose adds an _id property by default for each document
// it is of type ObjectId

// for pictures maybe using GridFS -- not sure but in the meantime we can probably hardcode pictures

export interface ClubData extends Document {
    _id: ObjectId;
    school: ObjectId;
    name: string;
    tagline: string;
    description: string;
    url: string;
    socials: object; // not sure what type to put here for the nested properties?
    clubLogo: ObjectId;
    pictures: ObjectId[];
    tags: ObjectId[]; // want to use to choose from a collection of tags rather than write their own tags
    createdAt: Date;
    updatedAt: Date;
}

const ClubSchema: Schema<ClubData> = new Schema(
    {
        school: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
        },
        name: {
            type: String,
            required: true,
        },
        tagline: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        url: {
            type: String,
        },
        socials: {
            website: {
                type: String,
            },
            discord: {
                type: String,
            },
            instagram: {
                type: String,
            },
        },
        clubLogo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image',
            // maybe can have a default picture thats stored in the database
        },
        pictures: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Image',
        },
        tags: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Tag',
        },
    },
    { timestamps: true }
);

const Club = mongoose.model<ClubData>('Club', ClubSchema);
export default Club;
