import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface UserNotificationData extends Document {
    _id: ObjectId;
    userId: ObjectId;
    notificationId: ObjectId;
    read: boolean;
}

const UserNotificationSchema: Schema<UserNotificationData> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    notificationId: {
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

const UserNotification = mongoose.model<UserNotificationData>('UserNotification', UserNotificationSchema);
export default UserNotification;
