import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';

const schema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
});

export type SchoolSchema = InferSchemaType<typeof schema>;
export type SchoolDoc = HydratedDocument<InferSchemaType<typeof schema>>;

const School = mongoose.model('School', schema);
export default School;
