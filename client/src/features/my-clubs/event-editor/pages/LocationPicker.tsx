import {
    ApiResponseBody,
    EventData,
    GetDailyVenueAvailabilityResponse,
    GetMonthlyVenueAvailabilityResponse,
    GetWeeklyVenueAvailabilityResponse,
    isSuccess,
    VenueAvailability,
} from '@clubhive/shared';
import { MonthlyVenueView, VenueCard, VenueFilters, VenueFilterType, ViewMode, WeeklyVenueView } from '../location-picker';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useToast } from '../../../../hooks/useToast.ts';
import { AlertCircle, Calendar, CalendarDays, Grid, List, MapPin, RefreshCw } from 'lucide-react';
import WebDatePicker from '../../../../components/date-picker/WebDatePicker';

interface LocationPickerProps {
    event: EventData;
    onEventChange: (event: EventData) => void;
}

export function LocationPicker({ event, onEventChange }: LocationPickerProps) {
    const [selectedDate, setSelectedDate] = useState(() => {
        // const today = new Date();
        const today = new Date('2025-01-15'); // TODO: switch back
        return today;
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    const [venues, setVenues] = useState<VenueAvailability[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { errorToast } = useToast();

    const [filters, setFilters] = useState<VenueFilterType>({
        search: '',
        roomType: '',
        building: '',
        minDuration: 0,
        searchMode: 'duration',
        specificWindow: undefined,
    });

    const [viewMode, setViewMode] = useState<ViewMode>('daily');
    const [weeklyVenues, setWeeklyVenues] = useState<VenueAvailability[][]>([]);
    const [monthlyVenues, setMonthlyVenues] = useState<VenueAvailability[][]>([]);

    const [selectedVenue, setSelectedVenue] = useState<VenueAvailability | null>(null);

    // Fetch venue availability data
    const fetchVenueAvailability = async (date: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/venues/availability/daily?date=${date}`, {
                credentials: 'include',
            });
            const data: ApiResponseBody<GetDailyVenueAvailabilityResponse> = await response.json();

            if (isSuccess(data)) {
                setVenues(data.rooms);
            } else {
                const errorMessage = data.error.message || 'Failed to fetch venue availability';
                setError(errorMessage);
                errorToast(errorMessage);
            }
        } catch (err) {
            const errorMessage = 'Unable to connect to venue availability service';
            setError(errorMessage);
            errorToast(errorMessage);
            console.error('Error fetching venue availability:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch weekly venue availability data
    const fetchWeeklyAvailability = async (startDate: Date) => {
        setLoading(true);
        setError(null);

        try {
            const startDateStr = startDate.toISOString().split('T')[0];
            const response = await fetch(`/api/venues/availability/weekly?date=${startDateStr}`, {
                credentials: 'include',
            });

            const data: ApiResponseBody<GetWeeklyVenueAvailabilityResponse> = await response.json();
            if (isSuccess(data)) {
                const weeklyData = data.days.map(day => day.rooms);
                setWeeklyVenues(weeklyData);
            } else {
                const errorMessage = data.error.message || 'Failed to fetch weekly availability';
                setError(errorMessage);
                errorToast(errorMessage);
                return;
            }
        } catch (err) {
            const errorMessage = 'Unable to connect to venue availability service';
            setError(errorMessage);
            errorToast(errorMessage);
            console.error('Error fetching weekly venue availability:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch monthly venue availability data
    const fetchMonthlyAvailability = async (monthDate: Date) => {
        setLoading(true);
        setError(null);

        try {
            const monthDateStr = monthDate.toISOString().split('T')[0];
            const response = await fetch(`/api/venues/availability/monthly?date=${monthDateStr}`, {
                credentials: 'include',
            });

            const data: ApiResponseBody<GetMonthlyVenueAvailabilityResponse> = await response.json();
            if (isSuccess(data)) {
                const monthlyData = data.days.map(day => day.rooms);
                setMonthlyVenues(monthlyData);
            } else {
                const errorMessage = data.error.message || 'Failed to fetch monthly availability';
                setError(errorMessage);
                errorToast(errorMessage);
                return;
            }
        } catch (err) {
            const errorMessage = 'Unable to connect to venue availability service';
            setError(errorMessage);
            errorToast(errorMessage);
            console.error('Error fetching monthly venue availability:', err);
        } finally {
            setLoading(false);
        }
    };

    // Close date picker when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setShowDatePicker(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch data when date or view mode changes
    useEffect(() => {
        const dateString = selectedDate.toISOString().split('T')[0];
        if (viewMode === 'daily') {
            fetchVenueAvailability(dateString);
        } else if (viewMode === 'weekly') {
            const startOfWeek = new Date(selectedDate);
            const dayOfWeek = startOfWeek.getDay();
            const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            startOfWeek.setDate(startOfWeek.getDate() + mondayOffset);
            fetchWeeklyAvailability(startOfWeek);
        } else if (viewMode === 'monthly') {
            const monthStart = new Date(selectedDate);
            monthStart.setDate(1);
            fetchMonthlyAvailability(monthStart);
        }
    }, [selectedDate, viewMode]);

    // Filter venues based on current filters
    const filteredVenues = useMemo(() => {
        return venues.filter(venue => {
            // Search filter
            if (
                filters.search &&
                !venue.room_name.toLowerCase().includes(filters.search.toLowerCase()) &&
                !venue.building_name.toLowerCase().includes(filters.search.toLowerCase())
            ) {
                return false;
            }

            // Room type filter
            if (filters.roomType && venue.room_type !== filters.roomType) {
                return false;
            }

            // Building filter
            if (filters.building && venue.building_name !== filters.building) {
                return false;
            }

            // Duration or specific window filter
            if (filters.searchMode === 'duration' && filters.minDuration > 0) {
                const hasSlotMeetingDuration = venue.availability.some(slot => {
                    const start = new Date(slot.start_time);
                    const end = new Date(slot.end_time);
                    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                    return duration >= filters.minDuration;
                });
                if (!hasSlotMeetingDuration) {
                    return false;
                }
            } else if (filters.searchMode === 'specific-window' && filters.specificWindow) {
                const hasOverlap = venue.availability.some(slot => {
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
                if (!hasOverlap) {
                    return false;
                }
            }

            return true;
        });
    }, [venues, filters]);

    const availableRoomTypes = useMemo(() => [...new Set(venues.map(v => v.room_type))].sort(), [venues]);
    const availableBuildings = useMemo(() => [...new Set(venues.map(v => v.building_name).filter(b => b))].sort(), [venues]);

    const handleVenueSelect = (venue: VenueAvailability, date?: Date) => {
        setSelectedVenue(venue);
        onEventChange({ ...event, location: venue.room_name });
    };

    const handleDateChange = (newDate: Date) => {
        setSelectedDate(newDate);
        setSelectedVenue(null); // Clear selection when date changes
        setShowDatePicker(false);
    };

    return (
        <div className="bg-surface rounded-lg shadow p-8 border border-outline-variant min-h-[600px]">
            {/* Date Selection and View Mode */}
            <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-2">
                            <Calendar className="inline h-4 w-4 mr-1" />
                            {viewMode === 'daily' ? 'Event Date' : 'Week Starting'}
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="relative" ref={datePickerRef}>
                                <button
                                    onClick={() => setShowDatePicker(!showDatePicker)}
                                    className="px-3 py-2.5 pr-10 border border-outline-variant rounded-lg bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary hover:bg-surface-variant/50 transition-colors min-w-[160px] text-left relative cursor-pointer"
                                >
                                    {selectedDate.toLocaleDateString()}
                                    <Calendar className="h-4 w-4 text-on-surface-variant absolute right-3 top-1/2 transform -translate-y-1/2" />
                                </button>
                                {showDatePicker && (
                                    <div className="absolute z-50 mt-2 bg-surface border border-outline-variant rounded-md shadow-lg">
                                        <WebDatePicker selectedDate={selectedDate} onDateSelected={handleDateChange} />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() =>
                                    viewMode === 'daily'
                                        ? fetchVenueAvailability(selectedDate.toISOString().split('T')[0])
                                        : fetchWeeklyAvailability(selectedDate)
                                }
                                disabled={loading}
                                className="px-3 py-2 border border-outline-variant rounded-lg hover:bg-surface-variant/50 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                            >
                                <RefreshCw className={`h-4 w-4 text-on-surface ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-2">View Mode</label>
                        <div className="flex items-center border border-outline-variant rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('daily')}
                                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                    viewMode === 'daily' ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-variant/50'
                                }`}
                            >
                                <List className="inline h-4 w-4 mr-1" />
                                Daily
                            </button>
                            <button
                                onClick={() => setViewMode('weekly')}
                                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                    viewMode === 'weekly' ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-variant/50'
                                }`}
                            >
                                <Grid className="inline h-4 w-4 mr-1" />
                                Weekly
                            </button>
                            <button
                                onClick={() => setViewMode('monthly')}
                                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                    viewMode === 'monthly' ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-variant/50'
                                }`}
                            >
                                <CalendarDays className="inline h-4 w-4 mr-1" />
                                Monthly
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                    <VenueFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                        availableRoomTypes={availableRoomTypes}
                        availableBuildings={availableBuildings}
                    />
                </div>

                {/* Venues Content */}
                <div className="lg:col-span-4">
                    {error && (
                        <div className="flex items-center gap-2 p-4 bg-error/10 border border-error/30 rounded-lg text-error mb-4">
                            <AlertCircle className="h-5 w-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="h-6 w-6 animate-spin text-on-surface-variant" />
                            <span className="ml-2 text-on-surface-variant">Loading venues...</span>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-sm text-on-surface-variant">
                                    {viewMode === 'daily'
                                        ? `${filteredVenues.length} of ${venues.length} venues available`
                                        : viewMode === 'weekly'
                                          ? `${weeklyVenues.flat().length} total venue slots this week`
                                          : `${monthlyVenues.flat().length} total venue slots this month`}
                                </div>
                                {selectedVenue && (
                                    <div className="flex items-center gap-1 text-sm font-medium text-primary">
                                        <MapPin className="h-4 w-4" />
                                        Selected: {selectedVenue.room_name}
                                    </div>
                                )}
                            </div>

                            {viewMode === 'daily' ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {filteredVenues.map(venue => (
                                            <VenueCard
                                                key={`${venue.building_name}-${venue.room_name}`}
                                                venue={venue}
                                                isSelected={selectedVenue?.room_name === venue.room_name}
                                                onSelect={handleVenueSelect}
                                                filters={filters}
                                            />
                                        ))}
                                    </div>

                                    {filteredVenues.length === 0 && !loading && (
                                        <div className="text-center py-12">
                                            <MapPin className="h-12 w-12 text-on-surface-variant mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-on-surface mb-2">No venues found</h3>
                                            <p className="text-on-surface-variant">
                                                Try adjusting your filters or selecting a different date
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : viewMode === 'weekly' ? (
                                <WeeklyVenueView
                                    venues={weeklyVenues}
                                    weekDates={Array.from({ length: 7 }, (_, i) => {
                                        const date = new Date(selectedDate);
                                        const dayOfWeek = date.getDay();
                                        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                                        date.setDate(date.getDate() + mondayOffset + i);
                                        return date;
                                    })}
                                    filters={filters}
                                    onVenueSelect={handleVenueSelect}
                                    selectedVenue={selectedVenue}
                                />
                            ) : (
                                <MonthlyVenueView
                                    venues={monthlyVenues}
                                    monthDate={selectedDate}
                                    filters={filters}
                                    onVenueSelect={handleVenueSelect}
                                    selectedVenue={selectedVenue}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
