export interface VenueAvailability {
    room_name: string;
    room_type: string;
    building_name: string;
    availability: TimeSlot[];
}

export interface TimeSlot {
    start_time: string;
    end_time: string;
}

export interface VenueFilters {
    search: string;
    roomType: string;
    building: string;
    minDuration: number; // in hours
    searchMode: 'duration' | 'specific-window';
    specificWindow?: {
        startTime: Date;
        endTime: Date;
    };
}

export type ViewMode = 'daily' | 'weekly' | 'monthly';

export interface AvailabilityResponse {
    success: boolean;
    data: {
        date: string;
        rooms: VenueAvailability[];
    };
}
