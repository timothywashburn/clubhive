import User, { UserDoc } from '../models/user-schema';
import ClubMembership from '../models/club-membership-schema';
import { updateDocument } from '@/utils/db-doc-utils';
import { UpdateUserRequest } from '@clubhive/shared';
import Auth from '@/models/auth-schema';
import bcrypt from 'bcrypt';

export interface UserWithCounts extends UserDoc {
    clubsCount: number;
}

export default class UserController {
    static async getAllUsers(): Promise<UserWithCounts[]> {
        const users = await User.find({}).populate('school').exec();

        const usersWithCounts = await Promise.all(
            users.map(async user => {
                try {
                    const clubsCount = await ClubMembership.countDocuments({ user: user._id }).exec();

                    return {
                        ...user.toObject(),
                        clubsCount,
                    } as UserWithCounts;
                } catch (error) {
                    console.error('Error counting clubs for user:', user._id, error);
                    return {
                        ...user.toObject(),
                        clubsCount: 0,
                    } as UserWithCounts;
                }
            })
        );

        return usersWithCounts;
    }

    static async getUserById(id: string): Promise<UserWithCounts | null> {
        const user = await User.findById(id).populate('school').exec();
        if (!user) return null;

        try {
            const clubsCount = await ClubMembership.countDocuments({ user: user._id }).exec();

            return {
                ...user.toObject(),
                clubsCount,
            } as UserWithCounts;
        } catch (error) {
            console.error('Error counting clubs for user:', user._id, error);
            return {
                ...user.toObject(),
                clubsCount: 0,
            } as UserWithCounts;
        }
    }

    static async updateUser(id: string, updates: UpdateUserRequest): Promise<UserDoc> {
        const result = await updateDocument(User, id, updates);
        await result.populate('school');
        return result;
    }

    static async getUserEmail(userId: string): Promise<string | null> {
        const auth = await Auth.findOne({ userId }).lean();
        return auth?.email || null;
    }

    static async updateUserEmail(userId: string | undefined, newEmail: string): Promise<void> {
        await Auth.updateOne({ userId }, { $set: { email: newEmail } });
    }

    static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        const auth = await Auth.findOne({ userId }).exec();

        if (!auth) {
            throw new Error('Auth not found');
        }

        const compare = await bcrypt.compare(currentPassword, auth.password);
        if (!compare) {
            throw new Error('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        auth.password = hashedPassword;
        await auth.save();
    }
}
