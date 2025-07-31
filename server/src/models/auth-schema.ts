import mongoose, { Document, Schema, ObjectId } from 'mongoose';

export interface AuthData extends Document {
    _id: ObjectId;
    email: string;
    password: string;
    emailVerified: boolean;
    userId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const AuthSchema: Schema<AuthData> = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        emailVerified: {
            type: Boolean,
            default: false,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

const Auth = mongoose.model<AuthData>('Auth', AuthSchema);
export default Auth;
