import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// mongoose adds an _id property by default for each document
// it is of type ObjectId

export interface UserData extends Document {
    _id: ObjectId;
    name: string;
    school: ObjectId; // use school_id
    major: string;
    educationType: EducationType;
    year: Year;
    createdAt: Date;
    updatedAt: Date;
}

export enum EducationType {
    UNDERGRADUATE = 'Undergraduate',
    GRADUATE = 'Graduate',
}

export enum Year {
    FIRST = '1',
    SECOND = '2',
    THIRD = '3',
    FOURTH = '4',
    OVER_FOUR = '>4',
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
            enum: Object.values(EducationType),
            required: true,
        },
        year: {
            type: String,
            enum: Object.values(Year),
            required: true,
        },
    },
    { timestamps: true }
);

const User = mongoose.model<UserData>('User', UserSchema);
export default User;
