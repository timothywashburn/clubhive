import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';

const schema = new Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        club: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Club',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        pictures: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Image',
        },
    },
    { timestamps: true }
);

export type NotificationSchema = InferSchemaType<typeof schema>;
export type NotificationDoc = HydratedDocument<InferSchemaType<typeof schema>>;

const Notification = mongoose.model('Notification', schema);
export default Notification;
