import mongoose, { Document, Schema } from 'mongoose';

export interface AuthData extends Document {
    email: string;
    password: string;
    emailVerified: boolean;
}

const AuthSchema: Schema<AuthData> = new Schema({
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
});

const Auth = mongoose.model<AuthData>('Auth', AuthSchema);
export default Auth;
