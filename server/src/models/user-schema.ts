import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// mongoose adds an _id property by default for each document
// it is of type ObjectId

export interface UserData extends Document {
    name: string;
    school: ObjectId; // use school_id
    major: string;
    educationType: Enumerator;
    year: Enumerator;
}

const UserSchema: Schema<UserData> = new Schema({
    name: {
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
    educationType: {
        type: String,
        enum: ['Undergraduate', 'Postgraduate'],
        required: true,
    },
    year: {
        type: String,
        enum: ['1st year', '2nd year', '3rd year', '4th year', '>4th year'],
        required: true,
    },
});

const User = mongoose.model<UserData>('User', UserSchema);
export default User;
