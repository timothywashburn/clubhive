import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Club from '../../../models/club-schema';
import ClubMembership from '../../../models/club-membership-schema';
import User, { UserData } from '../../../models/user-schema';
import SavedEvents from '../../../models/saved-events';
import Event from '../../../models/event-schema';
import ClubSnapshot, { ClubSnapshotData, ClubSnapshotDocument } from '../../../models/club-snapshot-schema';
import { ErrorCode } from '@clubhive/shared';

dotenv.config();

async function generateDailyClubStats() {
    // console.log('Starting daily club stats generation for ClubSnapshot...'); IDK if this is needed
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI environment variable is not set for dailyStats');
        }
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(mongoUri);
            // console.log('MongoDB connected for daily stats job.');
        }
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0, -1);

        const existingSnapshot = await ClubSnapshot.findOne({ date: startOfToday });
        if (existingSnapshot) {
            console.log('Snapshot already exists. Another one cannot be generated at the moment.');
            return;
        }
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

        const clubs = await Club.find({});
        const clubsStats: ClubSnapshotData[] = [];

        const previousDaySnapshot = await ClubSnapshot.findOne({ date: startOfYesterday });

        for (const club of clubs) {
            try {
                const currentMemberCount = await ClubMembership.countDocuments({ clubId: club._id });

                const newMembersToday = await ClubMembership.countDocuments({
                    clubId: club._id,
                    createdAt: { $gte: startOfToday, $lt: endOfToday },
                });

                let leavingMembersToday = 0;
                if (previousDaySnapshot) {
                    const previousClubStats = previousDaySnapshot.clubs.find(c => c.clubId.equals(club.id));
                    if (previousClubStats) {
                        const expectedCountIfNoLeaves = previousClubStats.memberCount + newMembersToday;
                        leavingMembersToday = Math.max(0, expectedCountIfNoLeaves - currentMemberCount);
                    }
                }

                let eventSavesToday = 0;
                const clubEvents = await Event.find({ clubId: club._id }).select('_id');
                const clubEventIds = clubEvents.map(event => event._id);
                if (clubEventIds.length > 0) {
                    eventSavesToday = await SavedEvents.countDocuments({
                        eventId: { $in: clubEventIds },
                        savedAt: { $gte: startOfToday, $lt: endOfToday },
                    });
                }

                const activeMemberships = await ClubMembership.find({ clubId: club._id }).populate<{ userId: UserData }>('userId');
                const majorCount: Record<string, number> = {};
                for (const member of activeMemberships) {
                    if (member.userId && member.userId.major) {
                        majorCount[member.userId.major] = (majorCount[member.userId.major] || 0) + 1;
                    }
                }
                const majorDistribution = Object.entries(majorCount).map(([major, count]) => ({ major, count }));

                clubsStats.push({
                    clubId: club.id,
                    memberCount: currentMemberCount,
                    newMembersToday: newMembersToday,
                    leavingMembersToday: leavingMembersToday,
                    eventSavesToday: eventSavesToday,
                    majorDistribution: majorDistribution,
                });
            } catch (clubError) {
                console.error(`Error calculating stats for club ${club.name}:`, ErrorCode);
            }
        }

        await ClubSnapshot.findOneAndUpdate(
            { date: startOfToday },
            { clubs: clubsStats },
            { upsert: true, new: true } // again helps avoid multiple snapshots in the same day
        );

        // console.log(`Daily club snapshot generated for ${startOfToday.toISOString().split('T')[0]} with enriched data for ${clubsStats.length} clubs.`);
    } catch (mainError) {
        console.error('Error: Unable to generate daily stats', ErrorCode);
    } finally {
        await mongoose.disconnect();
    }
}

if (require.main === module) {
    generateDailyClubStats();
}
