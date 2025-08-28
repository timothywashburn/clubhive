import { Search, Filter, Building, Clock, Calendar } from 'lucide-react';
import { VenueFilterType as VenueFiltersType } from './types';
import { useState } from 'react';
import TimeRangePicker from '../../../../components/date-picker/TimeRangePicker.tsx';

interface VenueFiltersProps {
    filters: VenueFiltersType;
    onFiltersChange: (filters: VenueFiltersType) => void;
    availableRoomTypes: string[];
    availableBuildings: string[];
}

export function VenueFilters({ filters, onFiltersChange, availableRoomTypes, availableBuildings }: VenueFiltersProps) {
    const [showTimeRangePicker, setShowTimeRangePicker] = useState(false);
    // Store previous values for each search mode
    const [previousDuration, setPreviousDuration] = useState(0);
    const [previousTimeWindow, setPreviousTimeWindow] = useState<{ startTime: Date; endTime: Date } | undefined>(undefined);

    const updateFilter = (key: keyof VenueFiltersType, value: string | number) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const handleSearchModeChange = (mode: 'duration' | 'specific-window') => {
        // Save current values before switching
        if (filters.searchMode === 'duration' && filters.minDuration > 0) {
            setPreviousDuration(filters.minDuration);
        } else if (filters.searchMode === 'specific-window' && filters.specificWindow) {
            setPreviousTimeWindow(filters.specificWindow);
        }

        // Switch mode and restore previous value if available
        if (mode === 'duration') {
            onFiltersChange({
                ...filters,
                searchMode: mode,
                minDuration: previousDuration,
                specificWindow: undefined,
            });
        } else {
            onFiltersChange({
                ...filters,
                searchMode: mode,
                minDuration: 0,
                specificWindow: previousTimeWindow,
            });
        }
    };

    return (
        <div className="bg-surface rounded-lg border border-outline-variant p-4 space-y-4">
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-on-surface-variant" />
                <h3 className="font-medium text-on-surface">Filters</h3>
            </div>

            {/* Search */}
            <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Search Venues</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={e => updateFilter('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface text-sm"
                        placeholder="Search by room name..."
                    />
                </div>
            </div>

            {/* Room Type Filter */}
            <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Room Type</label>
                <select
                    value={filters.roomType}
                    onChange={e => updateFilter('roomType', e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface text-sm"
                >
                    <option value="">All Types</option>
                    {availableRoomTypes.map(type => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            {/* Building Filter */}
            <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                    <Building className="inline h-4 w-4 mr-1" />
                    Building
                </label>
                <select
                    value={filters.building}
                    onChange={e => updateFilter('building', e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface text-sm"
                >
                    <option value="">All Buildings</option>
                    {availableBuildings.map(building => (
                        <option key={building} value={building}>
                            {building}
                        </option>
                    ))}
                </select>
            </div>

            {/* Search Mode Toggle */}
            <div>
                <label className="block text-sm font-medium text-on-surface mb-3">Search Type</label>
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="searchMode"
                            value="duration"
                            checked={filters.searchMode === 'duration'}
                            onChange={() => handleSearchModeChange('duration')}
                            className="text-primary focus:ring-primary"
                        />
                        <Clock className="h-4 w-4 text-on-surface-variant" />
                        <span className="text-sm text-on-surface">Minimum Duration</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="searchMode"
                            value="specific-window"
                            checked={filters.searchMode === 'specific-window'}
                            onChange={() => handleSearchModeChange('specific-window')}
                            className="text-primary focus:ring-primary"
                        />
                        <Calendar className="h-4 w-4 text-on-surface-variant" />
                        <span className="text-sm text-on-surface">Specific Time Window</span>
                    </label>
                </div>
            </div>

            {/* Duration Filter (when in duration mode) */}
            {filters.searchMode === 'duration' && (
                <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">Minimum Duration (hours)</label>
                    <select
                        value={filters.minDuration}
                        onChange={e => updateFilter('minDuration', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface text-sm"
                    >
                        <option value={0}>Any Duration</option>
                        <option value={1}>1+ hours</option>
                        <option value={2}>2+ hours</option>
                        <option value={3}>3+ hours</option>
                        <option value={4}>4+ hours</option>
                        <option value={6}>6+ hours</option>
                        <option value={8}>8+ hours</option>
                    </select>
                </div>
            )}

            {/* Time Window Picker (when in specific-window mode) */}
            {filters.searchMode === 'specific-window' && (
                <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">Desired Time Window</label>
                    <button
                        onClick={() => setShowTimeRangePicker(true)}
                        className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface text-sm text-left"
                    >
                        {filters.specificWindow ? (
                            <span>
                                {filters.specificWindow.startTime.toLocaleTimeString([], {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                })}{' '}
                                -{' '}
                                {filters.specificWindow.endTime.toLocaleTimeString([], {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                })}
                            </span>
                        ) : (
                            <span className="text-on-surface-variant">Select time range...</span>
                        )}
                    </button>

                    {showTimeRangePicker && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <TimeRangePicker
                                startTime={filters.specificWindow?.startTime}
                                endTime={filters.specificWindow?.endTime}
                                onStartTimeChange={startTime => {}}
                                onEndTimeChange={endTime => {}}
                                onDismiss={() => setShowTimeRangePicker(false)}
                                onDone={(startTime, endTime) => {
                                    onFiltersChange({
                                        ...filters,
                                        specificWindow: { startTime, endTime },
                                    });
                                    setShowTimeRangePicker(false);
                                }}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Clear Filters */}
            <button
                onClick={() =>
                    onFiltersChange({
                        search: '',
                        roomType: '',
                        building: '',
                        minDuration: 0,
                        searchMode: 'duration',
                        specificWindow: undefined,
                    })
                }
                className="w-full px-3 py-2 text-sm text-on-surface-variant hover:text-on-surface border border-outline-variant rounded-lg hover:bg-surface-variant/50 transition-colors"
            >
                Clear All Filters
            </button>
        </div>
    );
}
