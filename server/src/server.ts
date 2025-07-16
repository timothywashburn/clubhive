import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ApiManager from '@/controllers/api-manager';

dotenv.config();

const app = express();
const PORT = 3000;

import userRoutes from './routes/user-routes';
import clubRoutes from './routes/club-routes';
import eventRoutes from './routes/event-routes';

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

app.use('/api/users', userRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/event', eventRoutes); // not exactly sure if im doing this right; would appreciate feedback

const startServer = async () => {
    await connectDB();

    app.use(ApiManager.getInstance().getRouter());

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
