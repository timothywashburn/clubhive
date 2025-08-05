import { CreateSchoolRequest, UpdateSchoolRequest } from '@clubhive/shared';
import School, { SchoolDoc } from '../models/school-schema';
import Club from '../models/club-schema';
import User from '../models/user-schema';
import { updateDocument } from '@/utils/db-doc-utils';

export interface SchoolWithCounts extends SchoolDoc {
    clubCount: number;
    studentCount: number;
}

export default class SchoolController {
    static async createSchool(data: CreateSchoolRequest): Promise<SchoolDoc> {
        const newSchool = new School({
            name: data.name,
            location: data.location,
        });

        const result = await newSchool.save();
        return result;
    }

    static async getAllSchools(): Promise<SchoolWithCounts[]> {
        const schools = await School.find({}).exec();

        const schoolsWithCounts = await Promise.all(
            schools.map(async school => {
                try {
                    const [clubCount, studentCount] = await Promise.all([
                        Club.countDocuments({ school: school._id }).exec(),
                        User.countDocuments({ school: school._id }).exec(),
                    ]);

                    return {
                        ...school.toObject(),
                        clubCount,
                        studentCount,
                    } as SchoolWithCounts;
                } catch (error) {
                    console.error('Error counting for school:', school._id, error);
                    return {
                        ...school.toObject(),
                        clubCount: 0,
                        studentCount: 0,
                    } as SchoolWithCounts;
                }
            })
        );

        return schoolsWithCounts;
    }

    static async getSchoolById(id: string): Promise<SchoolWithCounts | null> {
        const school = await School.findById(id).exec();
        if (!school) return null;

        const [clubCount, studentCount] = await Promise.all([
            Club.countDocuments({ school: school._id }),
            User.countDocuments({ school: school._id }),
        ]);

        return {
            ...school.toObject(),
            clubCount,
            studentCount,
        } as SchoolWithCounts;
    }

    static async updateSchool(id: string, updates: UpdateSchoolRequest): Promise<SchoolDoc> {
        const result = await updateDocument(School, id, updates);
        return result;
    }

    static async deleteSchool(id: string): Promise<boolean> {
        const result = await School.findByIdAndDelete(id).exec();
        return result !== null;
    }
}
