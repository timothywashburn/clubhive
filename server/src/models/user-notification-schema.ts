import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';

const schema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    notification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
        required: true,
    },
});

export type UserNotificationSchema = InferSchemaType<typeof schema>;
export type UserNotificationDoc = HydratedDocument<InferSchemaType<typeof schema>>;

const UserNotification = mongoose.model('UserNotification', schema);
export default UserNotification;
