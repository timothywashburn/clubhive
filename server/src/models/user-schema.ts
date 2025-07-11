import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// mongoose adds an _id property by default for each document
// it is of type ObjectId

export interface UserData extends Document {
    _id: ObjectId;
    name: string;
    school: ObjectId; // use school_id
    major: string;
    educationType: Enumerator;
    year: Enumerator;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<UserData> = new Schema(
    {
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
            enum: ['1', '2', '3', '4', '>4'],
            required: true,
        },
    },
    { timestamps: true }
);

const User = mongoose.model<UserData>('User', UserSchema);
export default User;
