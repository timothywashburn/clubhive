import User, { UserDoc } from '../models/user-schema';
import ClubMembership from '../models/club-membership-schema';

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
}
