export type TabType =
    | 'membership'
    | 'info'
    | 'events'
    | 'planner'
    | 'stats'
    | 'members'
    | 'event-details'
    | 'event-location'
    | 'event-tap'
    | 'event-funding';

export interface TabItem {
    key: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

export interface MembershipData {
    joinDate: string;
}
