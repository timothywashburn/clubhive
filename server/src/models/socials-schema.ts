import mongoose, { Document, Schema } from 'mongoose';

export interface SocialsData extends Document {
    website: string;
    discord: string;
    instagram: string;
}

const SocialsSchema: Schema<SocialsData> = new Schema({
    website: {
        type: String,
    },
    discord: {
        type: String,
    },
    instagram: {
        type: String,
    },
});

const Socials = mongoose.model<SocialsData>('Socials', SocialsSchema);
export default Socials;
