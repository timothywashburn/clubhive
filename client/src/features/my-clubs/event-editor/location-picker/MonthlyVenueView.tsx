import { VenueAvailability, VenueFilterType } from './types';
import { VenueDisplayCard } from './VenueDisplayCard';
import { MapPin } from 'lucide-react';

interface MonthlyVenueViewProps {
    venues: VenueAvailability[][]; // Array of 31 days worth of venue data
    monthDate: Date;
    filters?: VenueFilterType;
    onVenueSelect: (venue: VenueAvailability, date: Date) => void;
    selectedVenue?: VenueAvailability;
}

export function MonthlyVenueView({ venues, monthDate, filters, onVenueSelect, selectedVenue }: MonthlyVenueViewProps) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Get unique venues across all days
    const uniqueVenues = venues.reduce((acc, dayVenues) => {
        dayVenues?.forEach(venue => {
            const key = `${venue.building_name}-${venue.room_name}`;
            if (!acc.some(v => `${v.building_name}-${v.room_name}` === key)) {
                acc.push(venue);
            }
        });
        return acc;
    }, [] as VenueAvailability[]);

    // Generate calendar days for the month
    const getMonthDays = () => {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        const startPadding = firstDay.getDay(); // 0 = Sunday
        const days = [];

        // Add padding days from previous month
        for (let i = 0; i < startPadding; i++) {
            days.push(null);
        }

        // Add actual days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const monthDays = getMonthDays();

    // Helper function to check if a venue meets criteria for a specific day
    const venueHasAvailability = (venue: VenueAvailability, date: Date): boolean => {
        if (!filters) return venue.availability.length > 0;

        if (filters.searchMode === 'duration' && filters.minDuration > 0) {
            return venue.availability.some(slot => {
                const start = new Date(slot.start_time);
                const end = new Date(slot.end_time);
                const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                return duration >= filters.minDuration;
            });
        }

        if (filters.searchMode === 'specific-window' && filters.specificWindow) {
            return venue.availability.some(slot => {
                const slotStart = new Date(slot.start_time);
                const slotEnd = new Date(slot.end_time);
                const windowStart = filters.specificWindow!.startTime;
                const windowEnd = filters.specificWindow!.endTime;

                // Compare only the time portions (hours and minutes)
                const slotStartTime = slotStart.getHours() * 60 + slotStart.getMinutes();
                const slotEndTime = slotEnd.getHours() * 60 + slotEnd.getMinutes();
                const windowStartTime = windowStart.getHours() * 60 + windowStart.getMinutes();
                const windowEndTime = windowEnd.getHours() * 60 + windowEnd.getMinutes();

                return slotStartTime <= windowStartTime && slotEndTime >= windowEndTime;
            });
        }

        return venue.availability.length > 0;
    };

    const getVenueForDay = (venue: VenueAvailability, date: Date): VenueAvailability | null => {
        if (!date) return null;

        const dayIndex = date.getDate() - 1;
        if (dayIndex < 0 || dayIndex >= venues.length) return null;

        const dayVenues = venues[dayIndex] || [];
        return dayVenues.find(v => v.room_name === venue.room_name && v.building_name === venue.building_name) || null;
    };

    return (
        <>
            {/* Month Header */}
            <div className="mb-6 text-center">
                <h3 className="text-lg font-semibold text-on-surface">
                    {monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <p className="text-sm text-on-surface-variant mt-1">Each venue shows a mini calendar with availability</p>
            </div>

            {/* Venue Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {uniqueVenues.map(venue => {
                    const venueKey = `${venue.building_name}-${venue.room_name}`;
                    const isSelected = selectedVenue?.room_name === venue.room_name;

                    return (
                        <VenueDisplayCard
                            key={venueKey}
                            venue={venue}
                            isSelected={isSelected}
                            onSelect={onVenueSelect}
                            filters={filters}
                            mode="monthly"
                            monthDate={monthDate}
                            showSummary={false}
                        >
                            {/* Mini Calendar */}
                            <div className="space-y-2">
                                {/* Calendar Header */}
                                <div className="grid grid-cols-7 gap-1">
                                    {dayNames.map(day => (
                                        <div key={day} className="text-xs font-medium text-on-surface-variant text-center">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-1">
                                    {monthDays.map((date, index) => {
                                        if (!date) {
                                            return <div key={index} className="aspect-square" />;
                                        }

                                        const dayVenue = getVenueForDay(venue, date);
                                        const hasAvailability = dayVenue ? venueHasAvailability(dayVenue, date) : false;
                                        const isToday = date.toDateString() === new Date().toDateString();

                                        return (
                                            <div
                                                key={date.getDate()}
                                                className={`aspect-square text-xs flex items-center justify-center rounded cursor-pointer transition-all hover:scale-105 ${
                                                    hasAvailability
                                                        ? 'bg-primary text-white hover:brightness-80'
                                                        : dayVenue
                                                          ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                                                          : 'bg-surface-variant/30 text-on-surface-variant'
                                                } ${isToday ? 'ring-2 ring-primary' : ''}`}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    if (dayVenue) onVenueSelect(dayVenue, date);
                                                }}
                                                title={`${date.toLocaleDateString()} - ${
                                                    hasAvailability ? 'Meets criteria' : dayVenue ? 'Available' : 'No data'
                                                }`}
                                            >
                                                {date.getDate()}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </VenueDisplayCard>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 text-xs text-on-surface-variant py-6 mt-6 border-t border-outline-variant">
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-primary rounded" />
                    <span>Meets criteria</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-gray-300 rounded" />
                    <span>Available</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-surface-variant/50 border border-outline-variant rounded" />
                    <span>No data</span>
                </div>
            </div>

            {/* Empty State */}
            {uniqueVenues.length === 0 && (
                <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-on-surface-variant mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-on-surface mb-2">No venues found</h3>
                    <p className="text-on-surface-variant">Try adjusting your filters or selecting a different month</p>
                </div>
            )}
        </>
    );
}
