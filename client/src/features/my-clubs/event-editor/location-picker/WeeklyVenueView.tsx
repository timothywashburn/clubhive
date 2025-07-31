import { VenueAvailability, VenueFilters } from './types';
import { VisualAvailabilityDisplay } from './VisualAvailabilityDisplay';
import { Building2, MapPin } from 'lucide-react';

interface WeeklyVenueViewProps {
    venues: VenueAvailability[][];
    weekDates: Date[];
    filters?: VenueFilters;
    onVenueSelect: (venue: VenueAvailability, date: Date) => void;
    selectedVenue?: VenueAvailability;
}

export function WeeklyVenueView({ venues, weekDates, filters, onVenueSelect, selectedVenue }: WeeklyVenueViewProps) {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Get unique venues across all days
    const uniqueVenues = venues.reduce((acc, dayVenues) => {
        dayVenues.forEach(venue => {
            const key = `${venue.building_name}-${venue.room_name}`;
            if (!acc.some(v => `${v.building_name}-${v.room_name}` === key)) {
                acc.push(venue);
            }
        });
        return acc;
    }, [] as VenueAvailability[]);

    const getRoomTypeColor = (roomType: string) => {
        switch (roomType.toLowerCase()) {
            case 'program/event space':
                return 'text-purple-600 bg-purple-50 border-purple-200';
            case 'conference/meeting room':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'outdoor space':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'study room':
                return 'text-orange-600 bg-orange-50 border-orange-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getVenueForDay = (venue: VenueAvailability, dayIndex: number): VenueAvailability | null => {
        const dayVenues = venues[dayIndex] || [];
        return dayVenues.find(v => v.room_name === venue.room_name && v.building_name === venue.building_name) || null;
    };

    return (
        <div className="space-y-4">
            {/* Week header */}
            <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="font-medium text-on-surface">Venue</div>
                {weekDates.map((date, index) => (
                    <div key={index} className="text-center">
                        <div className="text-sm font-medium text-on-surface">{dayNames[index]}</div>
                        <div className="text-xs text-on-surface-variant">
                            {date.getMonth() + 1}/{date.getDate()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Venue rows */}
            <div className="space-y-3">
                {uniqueVenues.map(venue => {
                    const venueKey = `${venue.building_name}-${venue.room_name}`;
                    const isSelected = selectedVenue?.room_name === venue.room_name;

                    return (
                        <div
                            key={venueKey}
                            className={`bg-surface rounded-lg border p-4 ${
                                isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant'
                            }`}
                        >
                            <div className="grid grid-cols-8 gap-2 items-start">
                                {/* Venue info */}
                                <div className="space-y-2">
                                    <div>
                                        <h4 className="font-medium text-on-surface text-sm leading-tight">{venue.room_name}</h4>
                                        <div className="flex items-center gap-1 text-xs text-on-surface-variant mt-1">
                                            <Building2 className="h-3 w-3" />
                                            {venue.building_name || 'Unknown'}
                                        </div>
                                    </div>

                                    <div
                                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getRoomTypeColor(venue.room_type)}`}
                                    >
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {venue.room_type}
                                    </div>

                                    <div className="flex items-center space-x-3 mt-2">
                                        <div className="flex items-center space-x-1">
                                            <div className="w-3 h-3 bg-orange-400 rounded-sm" />
                                            <span className="text-xs text-on-surface-variant">Meets</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-3 h-3 bg-gray-300 rounded-sm" />
                                            <span className="text-xs text-on-surface-variant">Available</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Daily availability */}
                                {weekDates.map((date, dayIndex) => {
                                    const dayVenue = getVenueForDay(venue, dayIndex);

                                    return (
                                        <div
                                            key={dayIndex}
                                            className="cursor-pointer"
                                            onClick={() => dayVenue && onVenueSelect(dayVenue, date)}
                                        >
                                            {dayVenue ? (
                                                <VisualAvailabilityDisplay
                                                    availability={dayVenue.availability}
                                                    filters={filters}
                                                    height={160}
                                                />
                                            ) : (
                                                <div className="text-xs text-on-surface-variant text-center py-3">No data</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
