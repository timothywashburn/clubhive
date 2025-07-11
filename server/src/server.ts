import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ApiManager from '@/controllers/api-manager';
import '@/models/tag-schema';
import '@/models/club-schema';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const testSchema = new mongoose.Schema({
    message: String,
    timestamp: Date,
});

const TestModel = mongoose.model('Test', testSchema);

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI environment variable is required');
        }
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');

        // Test write and read
        const testDoc = new TestModel({
            message: 'Database connection test',
            timestamp: new Date(),
        });

        await testDoc.save();
        console.log('MongoDB write test successful');

        const readDoc = await TestModel.findById(testDoc._id);
        if (readDoc?.message === 'Database connection test') {
            console.log('MongoDB read test successful');
        } else {
            throw new Error('MongoDB read test failed');
        }
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const startServer = async () => {
    await connectDB();

    app.use(ApiManager.getInstance().getRouter());

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
