export interface VenueAvailabilitySlot {
    start_time: string;
    end_time: string;
}

export interface VenueAvailability {
    room_name: string;
    room_type: string;
    building_name: string;
    availability: VenueAvailabilitySlot[];
}

export interface GetDailyVenueAvailabilityResponse {
    date: string;
    rooms: VenueAvailability[];
}

export interface GetWeeklyVenueAvailabilityResponse {
    week_start: string;
    days: Array<{ date: string; rooms: VenueAvailability[] }>;
}

export interface GetMonthlyVenueAvailabilityResponse {
    month: string;
    year: number;
    days: Array<{ date: string; rooms: VenueAvailability[] }>;
}
