import { CreateClubRequest, UpdateClubRequest } from '@clubhive/shared';
import Club, { ClubDoc } from '../models/club-schema';
import ClubMembership from '../models/club-membership-schema';
import Event from '../models/event-schema';
import { updateDocument } from '@/utils/db-doc-utils';
import { ClubRole } from '@clubhive/shared';
import ClubMembershipController from './club-membership-controller';
import EventController from './event-controller';
import NotificationController from './notification-controller';

export interface ClubWithCounts extends ClubDoc {
    memberCount: number;
    eventCount: number;
}

export default class ClubController {
    static async createClub(data: CreateClubRequest): Promise<ClubDoc> {
        console.log('Data passed to createClub:', data);
        const newClub = new Club({
            school: data.school,
            name: data.name,
            tagline: data.tagline,
            description: data.description || '',
            url: data.url || '',
            status: data.status,
            socials: data.socials || {
                website: '',
                discord: '',
                instagram: '',
            },
            clubLogo: data.clubLogo,
            pictures: data.pictures || [],
            tags: data.tags || [],
        });

        const result = await newClub.save();
        const populatedClub = await Club.findById(result._id).populate('school').populate('tags').exec();

        return populatedClub!;
    }

    static async getAllClubs(): Promise<ClubWithCounts[]> {
        const clubs = await Club.find({}).populate('school').populate('tags').exec();

        const clubsWithCounts = await Promise.all(
            clubs.map(async club => {
                try {
                    const [memberCount, eventCount] = await Promise.all([
                        ClubMembership.countDocuments({ club: club._id }).exec(),
                        Event.countDocuments({ club: club._id }).exec(),
                    ]);

                    return {
                        ...club.toObject(),
                        memberCount,
                        eventCount,
                    } as ClubWithCounts;
                } catch (error) {
                    console.error('Error counting for club:', club._id, error);
                    return {
                        ...club.toObject(),
                        memberCount: 0,
                        eventCount: 0,
                    } as ClubWithCounts;
                }
            })
        );

        return clubsWithCounts;
    }

    static async updateClub(id: string, updates: UpdateClubRequest): Promise<ClubDoc> {
        const result = await updateDocument(Club, id, updates);
        await result.populate('school');
        await result.populate('tags');
        return result;
    }

    static async deleteClub(id: string): Promise<boolean> {
        try {
            const club = await Club.findById(id);
            if (!club) return false;

            console.log(`Starting cascade deletion for club: ${id}`);

            const [membershipCount, notificationCount, eventCount] = await Promise.all([
                ClubMembershipController.deleteAllMembershipsForClub(id),
                NotificationController.deleteAllNotificationsForClub(id),
                EventController.deleteAllEventsForClub(id),
            ]);

            console.log(`Deleted ${membershipCount} memberships, ${notificationCount} notifications, ${eventCount} events for club ${id}`);

            const result = await Club.findByIdAndDelete(id).exec();

            console.log(`Club ${id} deletion complete`);
            return result !== null;
        } catch (error) {
            console.error('Error during club cascade deletion:', error);
            throw error;
        }
    }

    static async getClubsByUserId(userId: string): Promise<{ doc: ClubDoc; userRole: ClubRole }[]> {
        const memberships = await ClubMembership.find({ user: userId })
            .populate<{ club: ClubDoc }>({
                path: 'club',
                populate: [{ path: 'school' }, { path: 'tags' }],
            })
            .exec();

        return memberships.map(membership => ({
            doc: membership.club,
            userRole: membership.role,
        }));
    }
}
