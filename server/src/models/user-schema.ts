import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// mongoose adds an _id property by default for each document
// it is of type ObjectId

export interface UserData extends Document {
    email: string;
    password: string;
    school: ObjectId; // use school_id
    major: string;
    year: number;
    clubs: ObjectId[]; // use club_id
}

const UserSchema: Schema<UserData> = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
    },
    major: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    clubs: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Club',
        default: [], // empty array
    },
});

const User = mongoose.model<UserData>('User', UserSchema);
export default User;
