import mongoose, { mongo, Schema } from 'mongoose';
import ClubSnapshot, { ClubSnapshotData } from '../models/club-snapshot-schema';
import { MemberDataPoint, MajorDistribution, ClubChartData } from '../types/club-chart-types';

export async function getClubChartData(clubId: mongoose.Types.ObjectId): Promise<ClubChartData> {
    const today = new Date();
    const targetYear = today.getFullYear();
    const targetMonth = today.getMonth();

    const chartStartDate = new Date(today.getFullYear() - 1, today.getMonth(), 1);
    const chartEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const aggregationResult = await ClubSnapshot.aggregate([
        {
            $match: {
                date: { $gte: chartStartDate, $lte: chartEndDate },
            },
        },
        {
            $unwind: '$clubs',
        },
        {
            $match: {
                'clubs.clubId': clubId,
            },
        },
        {
            $project: {
                _id: 0,
                date: '$date',
                clubStats: '$clubs',
            },
        },
        {
            $sort: { date: 1 },
        },
    ]);

    const dailyClubStats: Array<{ date: Date; clubStats: ClubSnapshotData }> = aggregationResult.map(doc => ({
        date: doc.date,
        clubStats: doc.clubStats,
    }));

    const memberCount = dailyClubStats.length > 0 ? dailyClubStats[dailyClubStats.length - 1].clubStats.memberCount : 0;

    const memberChanges: MemberDataPoint[] = dailyClubStats.map(stat => ({
        date: stat.date.toISOString().split('T')[0],
        newMembers: stat.clubStats.newMembersToday,
        leavingMembers: stat.clubStats.leavingMembersToday,
    }));

    const majorDistribution: MajorDistribution[] =
        dailyClubStats.length > 0 ? dailyClubStats[dailyClubStats.length - 1].clubStats.majorDistribution : [];

    let memberChange = 0;
    let memberChangePercent = 0;

    const lastFullMonthStart = new Date(targetYear, targetMonth - 1, 1);
    const lastFullMonthEnd = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    const monthBeforeLastFullMonthStart = new Date(targetYear, targetMonth - 2, 1);
    const monthBeforeLastFullMonthEnd = new Date(targetYear, targetMonth - 1, 0, 23, 59, 59, 999);

    let newLastMonth = 0;
    let leavingLastMonth = 0;
    let newMonthBeforeLast = 0;
    let leavingMonthBeforeLast = 0;

    for (const stat of dailyClubStats) {
        const statDate = stat.date;
        if (statDate >= lastFullMonthStart && statDate <= lastFullMonthEnd) {
            newLastMonth += stat.clubStats.newMembersToday;
            leavingLastMonth += stat.clubStats.leavingMembersToday;
        } else if (statDate >= monthBeforeLastFullMonthStart && statDate <= monthBeforeLastFullMonthEnd) {
            newMonthBeforeLast += stat.clubStats.newMembersToday;
            leavingMonthBeforeLast += stat.clubStats.leavingMembersToday;
        }
    }

    const netChangeLastMonth = newLastMonth - leavingLastMonth;
    const netChangeMonthBeforeLast = newMonthBeforeLast - leavingMonthBeforeLast;

    memberChange = netChangeLastMonth;

    if (netChangeMonthBeforeLast !== 0) {
        memberChangePercent = (memberChange / Math.abs(netChangeMonthBeforeLast)) * 100;
    } else if (netChangeLastMonth !== 0) {
        memberChangePercent = 100;
    } else {
        memberChangePercent = 0;
    }

    let eventSavesPerMonth = 0;
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    threeMonthsAgo.setDate(1);

    const recentSavesStats = dailyClubStats.filter(stat => stat.date >= threeMonthsAgo);
    const totalRecentSaves = recentSavesStats.reduce((sum, stat) => sum + stat.clubStats.eventSavesToday, 0);
    eventSavesPerMonth = totalRecentSaves / 3;

    const chartData: ClubChartData = {
        memberCount: parseFloat(memberCount.toFixed(0)),
        memberChange: parseFloat(memberChange.toFixed(2)),
        memberChangePercent: parseFloat(memberChangePercent.toFixed(2)),
        eventSavesPerMonth: parseFloat(eventSavesPerMonth.toFixed(0)),
        memberChanges,
        majorDistribution,
    };

    return chartData;
}
