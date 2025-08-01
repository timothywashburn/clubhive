export interface MemberDataPoint {
    date: string; // format is YYYY-MM-DD
    newMembers: number;
    leavingMembers: number;
}

export interface MajorDistribution {
    major: string;
    count: number;
}

export interface ClubChartData {
    memberCount: number;
    memberChange: number;
    memberChangePercent: number;
    eventSavesPerMonth: number;
    memberChanges: MemberDataPoint[];
    majorDistribution: MajorDistribution[];
}
