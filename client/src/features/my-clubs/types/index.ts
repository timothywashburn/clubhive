export type TabType = 'membership' | 'info' | 'events' | 'planner' | 'stats';

export interface TabItem {
    key: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

export interface MembershipData {
    joinDate: string;
    eventsAttended: number;
    totalEvents: number;
}
