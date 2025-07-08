import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// mongoose adds an _id property by default for each document
// it is of type ObjectId

export interface IUser extends Document {
    email: string;
    password: string;
    school: ObjectId; // use school_id
    major: string;
    year: number;
    clubs: ObjectId[]; // idk if this works buts its not showing errors
}

const UserSchema: Schema<IUser> = new Schema({
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
        type: [mongoose.Schema.Types.ObjectId], // the numbers are club_id
        ref: 'Club',
        required: true,
    },
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
