import { Building2, MapPin, Clock } from 'lucide-react';
import { VenueAvailability, VenueFilters } from './types';
import { VisualAvailabilityDisplay } from './VisualAvailabilityDisplay';

export type VenueDisplayMode = 'daily' | 'weekly' | 'monthly';

interface VenueDisplayCardProps {
    venue: VenueAvailability;
    isSelected: boolean;
    onSelect: (venue: VenueAvailability, date?: Date) => void;
    filters?: VenueFilters;
    mode: VenueDisplayMode;
    // Props for different modes
    availabilityHeight?: number;
    date?: Date;
    monthDate?: Date;
    showSummary?: boolean;
    compact?: boolean;
    children?: React.ReactNode; // For custom content like mini calendars
}

export function VenueDisplayCard({
    venue,
    isSelected,
    onSelect,
    filters,
    mode,
    availabilityHeight = 160,
    date,
    showSummary = true,
    compact = false,
    children,
}: VenueDisplayCardProps) {
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

    const totalAvailableHours = venue.availability.reduce((total, slot) => {
        const start = new Date(slot.start_time);
        const end = new Date(slot.end_time);
        return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);

    const handleClick = () => {
        onSelect(venue, date);
    };

    return (
        <div
            className={`bg-surface rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-outline-variant hover:border-outline'
            }`}
            onClick={handleClick}
        >
            <div className="space-y-3">
                {/* Venue Header */}
                <div>
                    <h3 className={`font-semibold text-on-surface leading-tight ${compact ? 'text-sm' : 'text-sm'}`}>{venue.room_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                            <Building2 className="h-3 w-3" />
                            {venue.building_name || 'Unknown Building'}
                        </div>
                    </div>
                </div>

                {/* Room Type Badge */}
                <div
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getRoomTypeColor(venue.room_type)}`}
                >
                    <MapPin className="h-3 w-3 mr-1" />
                    {venue.room_type}
                </div>

                {/* Summary Info (for daily mode) */}
                {showSummary && mode === 'daily' && (
                    <div className="flex items-center justify-between text-xs text-on-surface-variant">
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {venue.availability.length} slot{venue.availability.length !== 1 ? 's' : ''}
                        </div>
                        <div className="font-medium">{totalAvailableHours.toFixed(1)}h total</div>
                    </div>
                )}

                {/* Visual Availability (for daily/weekly modes) */}
                {(mode === 'daily' || mode === 'weekly') && (
                    <div className="mt-2">
                        <VisualAvailabilityDisplay availability={venue.availability} filters={filters} height={availabilityHeight} />
                        {/* Legend for daily mode only */}
                        {mode === 'daily' && venue.availability.length > 0 && (
                            <div className="flex items-center justify-center space-x-3 text-xs text-on-surface-variant mt-2 pt-2 border-t border-outline-variant/30">
                                <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 bg-orange-400 rounded-sm" />
                                    <span>Meets criteria</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 bg-gray-300 rounded-sm" />
                                    <span>Available</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Custom Content (for monthly mini calendars) */}
                {children && <div className="mt-2">{children}</div>}
            </div>
        </div>
    );
}
