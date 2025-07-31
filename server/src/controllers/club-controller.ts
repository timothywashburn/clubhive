import { CreateClubRequest, UpdateClubRequest } from '@clubhive/shared';
import Club, { ClubDoc } from '../models/club-schema';
import ClubMembership from '../models/club-membership-schema';
import { updateDocument } from '@/utils/db-doc-utils';
import { ClubRole } from '@clubhive/shared';

export default class ClubController {
    static async createClub(data: CreateClubRequest): Promise<ClubDoc> {
        const newClub = new Club({
            school: data.school,
            name: data.name,
            tagline: data.tagline,
            description: data.description || '',
            url: data.url || '',
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

    static async getAllClubs(): Promise<ClubDoc[]> {
        return await Club.find({}).populate('school').populate('tags').exec();
    }

    static async updateClub(id: string, updates: UpdateClubRequest): Promise<ClubDoc> {
        const result = await updateDocument(Club, id, updates);
        await result.populate('school');
        await result.populate('tags');
        return result;
    }

    static async deleteClub(id: string): Promise<boolean> {
        const result = await Club.findByIdAndDelete(id).exec();
        return result !== null;
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
