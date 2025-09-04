import { ErrorCode } from '../../../../../shared/src/types/api-types.ts';
import { UserClubData } from '../../../../../shared/src/types/club-types.ts';
import { useState, useMemo, useEffect } from 'react';
import MyLineChart from '../components/stats/LineChart.tsx';
import MyPolarChart from '../components/stats/PolarChart.tsx';
import { SegmentedButton, SegmentedButtonOption } from '../../../components/SegmentedButton.tsx';

interface StatsProps {
    club: UserClubData;
    isOfficer?: boolean;
    statsVisibleToAll?: boolean;
    setStatsVisibleToAll?: (value: boolean) => void;
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

// Using MockData for sprint review, will replace with actual data later
const mockData = {
    memberCount: 34,
    memberChange: 7,
    memberChangePercent: 4.8,
    eventSavesPerMonth: 5,
    memberChanges: [
        { date: '2024-07-05', newMembers: 9, leavingMembers: 4 },
        { date: '2024-07-18', newMembers: 7, leavingMembers: 2 },
        { date: '2024-08-03', newMembers: 10, leavingMembers: 3 },
        { date: '2024-08-20', newMembers: 8, leavingMembers: 2 },
        { date: '2024-09-10', newMembers: 6, leavingMembers: 1 },
        { date: '2024-09-25', newMembers: 11, leavingMembers: 5 },
        { date: '2024-10-07', newMembers: 8, leavingMembers: 3 },
        { date: '2024-10-22', newMembers: 10, leavingMembers: 5 },
        { date: '2024-11-12', newMembers: 6, leavingMembers: 2 },
        { date: '2024-11-28', newMembers: 8, leavingMembers: 4 },
        { date: '2024-12-05', newMembers: 7, leavingMembers: 3 },
        { date: '2024-12-19', newMembers: 9, leavingMembers: 2 },
        { date: '2025-01-08', newMembers: 6, leavingMembers: 1 },
        { date: '2025-01-23', newMembers: 4, leavingMembers: 2 },
        { date: '2025-02-14', newMembers: 5, leavingMembers: 1 },
        { date: '2025-02-28', newMembers: 8, leavingMembers: 3 },
        { date: '2025-03-10', newMembers: 7, leavingMembers: 2 },
        { date: '2025-03-25', newMembers: 9, leavingMembers: 4 },
        { date: '2025-04-05', newMembers: 10, leavingMembers: 3 },
        { date: '2025-04-20', newMembers: 8, leavingMembers: 2 },
        { date: '2025-05-11', newMembers: 6, leavingMembers: 1 },
        { date: '2025-05-26', newMembers: 11, leavingMembers: 5 },
        { date: '2025-06-03', newMembers: 8, leavingMembers: 3 },
        { date: '2025-06-18', newMembers: 10, leavingMembers: 5 },
        { date: '2025-07-02', newMembers: 6, leavingMembers: 2 },
        { date: '2025-07-15', newMembers: 8, leavingMembers: 4 },
        { date: '2025-07-23', newMembers: 7, leavingMembers: 3 },
    ] as MemberDataPoint[],
    majorDistribution: [
        { major: 'Computer Science', count: 55 },
        { major: 'Math-Economics', count: 40 },
        { major: 'Visual Arts', count: 20 },
        { major: 'General Biology', count: 35 },
        { major: 'Political Science', count: 25 },
        { major: 'Music', count: 20 },
    ] as MajorDistribution[],
};

export function Stats({ club, isOfficer, setStatsVisibleToAll, statsVisibleToAll }: StatsProps) {
    const [view, setView] = useState<'all-time' | 'last-12-months' | 'last-30-days' | 'yearly'>('all-time');
    const [memberChangesData, setMemberChangesData] = useState<MemberDataPoint[]>(mockData.memberChanges);
    const [majorDistribution, setMajorDistribution] = useState<MajorDistribution[]>(mockData.majorDistribution);
    const [memberCount, setMemberCount] = useState<number>(mockData.memberCount);
    const [memberChange, setMemberChange] = useState<number>(mockData.memberChange);
    const [memberChangePercent, setMemberChangePercent] = useState<number>(mockData.memberChangePercent);
    const [eventSavesPerMonth, setEventSavesPerMonth] = useState<number>(mockData.eventSavesPerMonth);

    // useEffect(() => {
    //     const fetchStats = async () => {
    //         try {
    //             const res = await fetch(`/api/club-stats/${club._id}`);
    //             if (!res.ok) throw new Error('Failed to fetch');
    //             const data = await res.json();

    //             setMemberChangesData(data.memberChanges || []);
    //             setMajorDistribution(data.majorDistribution || []);
    //             setMemberCount(data.memberCount || 0);
    //             setMemberChange(data.memberChange || 0);
    //             setMemberChangePercent(data.memberChangePercent || 0);
    //             setEventSavesPerMonth(data.eventSavesPerMonth || 0);
    //         } catch (error) {
    //             console.error('Error fetching club stats:', ErrorCode);
    //         }
    //     };
    //     fetchStats();
    // }, [club._id]);

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
        <div className="space-y-6 relative">
            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-3xl font-bold text-on-surface">Club Statistics</h3>
                    {isOfficer && setStatsVisibleToAll && (
                        <button
                            onClick={() => setStatsVisibleToAll(!statsVisibleToAll)}
                            className="px-4 py-2 text-sm font-medium bg-primary text-on-primary hover:bg-primary/90 rounded-md transition-colors"
                        >
                            {statsVisibleToAll ? 'Hide Stats from Users' : 'Make Stats Visible to Everyone'}
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                        <p className="text-lg font-medium text-on-surface mb-2">Member Count</p>
                        <p className="text-2xl font-bold text-primary">{memberCount}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium text-on-surface mb-2">Member Change</p>
                        <p className="text-2xl font-bold text-success">
                            +{memberChange} (+{memberChangePercent}%)
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium text-on-surface mb-2">Event Saves Per Month</p>
                        <p className="text-2xl font-bold text-primary">{eventSavesPerMonth}</p>
                    </div>
                </div>
            </div>

            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <h3 className="text-lg font-medium text-on-surface mb-4">Statistics Visualization</h3>

                <div className="mb-6">
                    <SegmentedButton
                        value={view}
                        onChange={setView}
                        options={
                            [
                                { value: 'all-time', label: 'All Time' },
                                { value: 'last-12-months', label: 'Last 12 Months' },
                                { value: 'last-30-days', label: 'Last 30 Days' },
                                { value: 'yearly', label: 'Yearly View' },
                            ] as SegmentedButtonOption<'all-time' | 'last-12-months' | 'last-30-days' | 'yearly'>[]
                        }
                    />
                </div>

                <h4 className="text-xl font-semibold mb-4 text-on-surface">
                    {view === 'all-time'
                        ? 'All Time Member Count'
                        : view === 'last-12-months'
                          ? 'Last 12 Months Member Count'
                          : view === 'last-30-days'
                            ? 'Last 30 Days Member Count'
                            : 'Yearly Member Count'}
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    <div className="h-96">
                        <MyLineChart data={lineChartData} view={view} />
                    </div>
                    <div className="h-96">
                        <MyPolarChart data={majorDistribution} />
                    </div>
                </div>
            </div>

            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="absolute inset-0 backdrop-blur-[4px] rounded-lg" />

                <div className="relative bg-surface rounded-lg shadow-lg p-8 border border-outline-variant max-w-md mx-4 text-center">
                    <h3 className="text-2xl font-bold text-primary mb-4">Coming Soon!</h3>
                    <p className="text-on-surface-variant mb-6">
                        Club statistics and analytics are currently in development. Stay tuned for detailed insights about your club's
                        growth and engagement!
                    </p>
                </div>
            </div>
        </div>
    );
}
