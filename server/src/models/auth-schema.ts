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

export type AuthSchema = InferSchemaType<typeof schema>;
export type AuthDoc = HydratedDocument<InferSchemaType<typeof schema>>;

const Auth = mongoose.model('Auth', schema);
export default Auth;
