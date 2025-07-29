import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';

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

const schema = new Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
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

export type UserSchema = InferSchemaType<typeof schema>;
export type UserDoc = HydratedDocument<InferSchemaType<typeof schema>>;

const User = mongoose.model('User', schema);
export default User;
