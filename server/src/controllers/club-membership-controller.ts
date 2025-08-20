import ClubMembership from '../models/club-membership-schema';
import Club from '../models/club-schema';
import { ClubRole } from '@clubhive/shared';

export default class ClubMembershipController {
    static async createMembership(clubId: string, userId: string, role: string) {
        const clubExists = await Club.findById(clubId);
        if (!clubExists) {
            throw new Error('Club not found');
        }

        try {
            const existingMembership = await ClubMembership.findOne({ club: clubId, user: userId });

            if (existingMembership) {
                throw new Error('User is already a member of this club');
            }

            const newMembership = new ClubMembership({
                club: clubId,
                user: userId,
                role: role,
            });
            await newMembership.save();
            return newMembership;
        } catch (error) {
            console.error('Error creating membership:', error);
            throw new Error('Internal server error');
        }
    }

    static async deleteMembership(clubId: string, userId: string) {
        const membership = await ClubMembership.findOneAndDelete({ club: clubId, user: userId });

        if (!membership) {
            throw new Error('Membership not found');
        }

        return true;
    }

    static async getUserClubRole(clubId: string, userId: string): Promise<ClubRole | null> {
        const membership = await ClubMembership.findOne({ club: clubId, user: userId });
        return membership ? membership.role : null;
    }

    static async isOfficerOrOwner(clubId: string, userId: string): Promise<boolean> {
        const role = await this.getUserClubRole(clubId, userId);
        return role === ClubRole.OFFICER || role === ClubRole.OWNER;
    }

    static async deleteAllMembershipsForClub(clubId: string): Promise<number> {
        const result = await ClubMembership.deleteMany({ club: clubId });
        return result.deletedCount || 0;
    }
}
