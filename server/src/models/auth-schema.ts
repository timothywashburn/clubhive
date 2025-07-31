import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';

const schema = new Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
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
    },
    { timestamps: true }
);

export type AuthSchema = InferSchemaType<typeof schema>;
export type AuthDoc = HydratedDocument<InferSchemaType<typeof schema>>;

const Auth = mongoose.model('Auth', schema);
export default Auth;
