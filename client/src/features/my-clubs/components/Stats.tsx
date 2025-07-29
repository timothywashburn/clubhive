import { ErrorCode } from '@clubhive/shared/index.ts';
import { Club } from '../types';
import MyLineChart from './stats/LineChart.tsx';
import MyPolarChart from './stats/PolarChart.tsx';
import { useState, useMemo, useEffect } from 'react';

interface StatsProps {
    club: Club;
}

interface MemberDataPoint {
    date: string;
    newMembers: number;
    leavingMembers: number;
}

interface MajorDistribution {
    major: string;
    count: number;
}

// Replaced the mockData with dynamic data but left it here for testing purposes
// const mockData = {
//     memberCount: 34,
//     memberChange: 7,
//     memberChangePercent: 4.8,
//     eventSavesPerMonth: 5,
//     memberChanges: [
//         { date: '2024-07-05', newMembers: 9, leavingMembers: 4 },
//         { date: '2024-07-18', newMembers: 7, leavingMembers: 2 },
//         { date: '2024-08-03', newMembers: 10, leavingMembers: 3 },
//         { date: '2024-08-20', newMembers: 8, leavingMembers: 2 },
//         { date: '2024-09-10', newMembers: 6, leavingMembers: 1 },
//         { date: '2024-09-25', newMembers: 11, leavingMembers: 5 },
//         { date: '2024-10-07', newMembers: 8, leavingMembers: 3 },
//         { date: '2024-10-22', newMembers: 10, leavingMembers: 5 },
//         { date: '2024-11-12', newMembers: 6, leavingMembers: 2 },
//         { date: '2024-11-28', newMembers: 8, leavingMembers: 4 },
//         { date: '2024-12-05', newMembers: 7, leavingMembers: 3 },
//         { date: '2024-12-19', newMembers: 9, leavingMembers: 2 },
//         { date: '2025-01-08', newMembers: 6, leavingMembers: 1 },
//         { date: '2025-01-23', newMembers: 4, leavingMembers: 2 },
//         { date: '2025-02-14', newMembers: 5, leavingMembers: 1 },
//         { date: '2025-02-28', newMembers: 8, leavingMembers: 3 },
//         { date: '2025-03-10', newMembers: 7, leavingMembers: 2 },
//         { date: '2025-03-25', newMembers: 9, leavingMembers: 4 },
//         { date: '2025-04-05', newMembers: 10, leavingMembers: 3 },
//         { date: '2025-04-20', newMembers: 8, leavingMembers: 2 },
//         { date: '2025-05-11', newMembers: 6, leavingMembers: 1 },
//         { date: '2025-05-26', newMembers: 11, leavingMembers: 5 },
//         { date: '2025-06-03', newMembers: 8, leavingMembers: 3 },
//         { date: '2025-06-18', newMembers: 10, leavingMembers: 5 },
//         { date: '2025-07-02', newMembers: 6, leavingMembers: 2 },
//         { date: '2025-07-15', newMembers: 8, leavingMembers: 4 },
//         { date: '2025-07-23', newMembers: 7, leavingMembers: 3 },
//     ] as MemberDataPoint[],
//     majorDistribution: [
//         { major: 'Computer Science', count: 55 },
//         { major: 'Math-Economics', count: 40 },
//         { major: 'Visual Arts', count: 20 },
//         { major: 'General Biology', count: 35 },
//         { major: 'Political Science', count: 25 },
//         { major: 'Music', count: 20 },
//     ] as MajorDistribution[],
//     }

export function Stats({ club }: StatsProps) {
    const [view, setView] = useState<'all-time' | 'last-12-months' | 'last-30-days' | 'yearly'>('all-time');
    const [memberChangesData, setMemberChangesData] = useState<MemberDataPoint[]>([]);
    const [majorDistribution, setMajorDistribution] = useState<MajorDistribution[]>([]);
    const [memberCount, setMemberCount] = useState<number>(0);
    const [memberChange, setMemberChange] = useState<number>(0);
    const [memberChangePercent, setMemberChangePercent] = useState<number>(0);
    const [eventSavesPerMonth, setEventSavesPerMonth] = useState<number>(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/club-stats/${club.id}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();

                setMemberChangesData(data.memberChanges || []);
                setMajorDistribution(data.majorDistribution || []);
                setMemberCount(data.memberCount || 0);
                setMemberChange(data.memberChange || 0);
                setMemberChangePercent(data.memberChangePercent || 0);
                setEventSavesPerMonth(data.eventSavesPerMonth || 0);
            } catch (error) {
                console.error('Error fetching club stats:', ErrorCode);
            }
        };
        fetchStats();
    }, [club.id]);

    const initialCount = memberCount > 0 ? memberCount : 0;
    const filteredMemberChangesData = useMemo(() => {
        const now = new Date();
        if (view === 'last-12-months') {
            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setFullYear(now.getFullYear() - 1);
            return memberChangesData.filter(item => new Date(item.date) >= twelveMonthsAgo);
        }
        if (view === 'last-30-days') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(now.getDate() - 30);
            return memberChangesData.filter(item => new Date(item.date) >= thirtyDaysAgo);
        }
        return memberChangesData;
    }, [view, memberChangesData]);

    const getRunningTotal = (data: MemberDataPoint[], initial: number) => {
        let runningCount = initial;
        return data.map(item => {
            runningCount = runningCount + item.newMembers - item.leavingMembers;
            return { ...item, totalMembers: runningCount };
        });
    };

    const getMonthlyChanges = (data: MemberDataPoint[]) =>
        data.map(item => ({
            ...item,
            monthlyChange: item.newMembers - item.leavingMembers,
        }));

    const getYearlyData = (data: MemberDataPoint[], initial: number) => {
        const yearlyChanges: { [year: number]: { year: string; newMembers: number; leavingMembers: number } } = {};

        data.forEach(item => {
            const year = new Date(item.date).getFullYear();
            if (!yearlyChanges[year]) {
                yearlyChanges[year] = { year: year.toString(), newMembers: 0, leavingMembers: 0 };
            }
            yearlyChanges[year].newMembers += item.newMembers;
            yearlyChanges[year].leavingMembers += item.leavingMembers;
        });

        let runningCount = initial;
        return Object.values(yearlyChanges).map(yearData => {
            runningCount = runningCount + yearData.newMembers - yearData.leavingMembers;
            return { ...yearData, totalMembers: runningCount };
        });
    };

    const aggregateMonthlyData = (data: MemberDataPoint[]): MemberDataPoint[] => {
        const aggregatedData: { [key: string]: MemberDataPoint } = {};

        data.forEach(item => {
            const date = new Date(item.date);
            const monthYear = `${date.getMonth()}-${date.getFullYear()}`;

            if (!aggregatedData[monthYear]) {
                aggregatedData[monthYear] = {
                    date: item.date,
                    newMembers: 0,
                    leavingMembers: 0,
                };
            }

            aggregatedData[monthYear].newMembers += item.newMembers;
            aggregatedData[monthYear].leavingMembers += item.leavingMembers;
        });

        return Object.values(aggregatedData);
    };

    const lineChartData = useMemo(() => {
        if (view === 'yearly') {
            return getYearlyData(memberChangesData, initialCount);
        }

        const aggregatedData = aggregateMonthlyData(filteredMemberChangesData);

        if (view === 'last-12-months') {
            return getMonthlyChanges(aggregatedData);
        }

        if (view === 'last-30-days') {
            return getMonthlyChanges(filteredMemberChangesData);
        }

        return getRunningTotal(aggregatedData, initialCount);
    }, [view, filteredMemberChangesData, memberChangesData, initialCount]);

    return (
        <div className="space-y-6">
            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <h3 className="text-3xl font-bold text-primary mb-5">Club Statistics</h3>

                <div className="grid grid-cols-3 gap-20 mb-8">
                    <div>
                        <p className="text-lg font-medium text-on-surface mb-2">Member Count</p>
                        <p className="text-lg font-small text-on-surface mb-2 ml-10">{memberCount}</p>
                    </div>
                    <div>
                        <p className="text-lg font-medium text-on-surface mb-2">Member Change</p>
                        <p className="text-lg font-small text-on-surface mb-2 ml-6">
                            +{memberChange} (+{memberChangePercent}%)
                        </p>
                    </div>
                    <div>
                        <p className="text-lg font-medium text-on-surface mb-2">Event Saves Per Month</p>
                        <p className="text-lg font-small text-on-surface mb-2 ml-20">{eventSavesPerMonth}</p>
                    </div>
                </div>

                <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                    <h3 className="text-lg font-medium text-on-surface mb-4">Statistics Visualization</h3>

                    <div className="flex gap-4 mb-4">
                        <button
                            onClick={() => setView('all-time')}
                            className={`px-4 py-2 rounded-md ${
                                view === 'all-time' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            All Time
                        </button>
                        <button
                            onClick={() => setView('last-12-months')}
                            className={`px-4 py-2 rounded-md ${
                                view === 'last-12-months' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            Last 12 Months
                        </button>
                        <button
                            onClick={() => setView('last-30-days')}
                            className={`px-4 py-2 rounded-md ${
                                view === 'last-30-days' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            Last 30 Days
                        </button>
                        <button
                            onClick={() => setView('yearly')}
                            className={`px-4 py-2 rounded-md ${view === 'yearly' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Yearly View
                        </button>
                    </div>

                    <h4 className="text-xl font-semibold mb-4">
                        {view === 'all-time'
                            ? 'All Time Member Count'
                            : view === 'last-12-months'
                              ? 'Last 12 Months Member Count'
                              : view === 'last-30-days'
                                ? 'Last 30 Days Member Count'
                                : 'Yearly Member Count'}
                    </h4>

                    <div className="rounded-lg flex">
                        <div
                            style={{
                                width: '45%',
                                height: '400px',
                                marginLeft: '10px',
                                marginRight: '30px',
                                marginTop: '50px',
                            }}
                        >
                            <MyLineChart data={lineChartData} view={view} />
                        </div>
                        <div style={{ width: '45%', height: '400px', marginLeft: '40px', marginRight: '0px' }}>
                            <MyPolarChart data={majorDistribution} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
