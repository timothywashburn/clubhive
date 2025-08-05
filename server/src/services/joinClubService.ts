import mongoose from 'mongoose';
import { ErrorCode } from '@clubhive/shared';

const TEST_USER_ID = new mongoose.Types.ObjectId('507f1f77bcf86cd799439020');

export const handleRegistration = async (clubId: string) => {
    const userId = TEST_USER_ID;

    if (!userId) {
        throw new Error('Test user ID not found.');
    }

    try {
        const res = await fetch('/api/club-profile/memberships', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clubId, userId }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error?.message || 'Server error.');
        }

        return await res.json();
    } catch (err) {
        console.error('Registration API error:', err);
        throw err;
    }
};
