import { ApiEndpoint, AuthType } from '@/types/api-types';
import Club from '@/models/club-schema';
import User from '@/models/user-schema';
import Event from '@/models/event-schema';
import School from '@/models/school-schema';
import { ErrorCode } from '@clubhive/shared';

export interface LandingStatisticsResponse {
    users: number;
    clubs: number;
    events: number;
    schools: number;
}

export const landingStatisticsEndpoint: ApiEndpoint<undefined, LandingStatisticsResponse> = {
    path: '/api/landing-statistics',
    method: 'get',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            const clubsCount = await Club.countDocuments();
            const usersCount = await User.countDocuments();
            const eventsCount = await Event.countDocuments({
                published: true,
            });
            const schoolsCount = await School.countDocuments();

            const response: LandingStatisticsResponse = {
                users: usersCount,
                clubs: clubsCount,
                events: eventsCount,
                schools: schoolsCount,
            };

            res.json({
                success: true,
                ...response,
            });
        } catch (error) {
            console.error('Error fetching landing statistics:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch landing statistics',
                    code: ErrorCode.INTERNAL_SERVER_ERROR,
                },
            });
        }
    },
};
