export interface Club {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    role: 'member' | 'officer' | 'owner';
    tagline: string;
    location: string;
    meetingTime: string;
    logoImage: string;
    brandColor: string;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    attendees: number;
}

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
