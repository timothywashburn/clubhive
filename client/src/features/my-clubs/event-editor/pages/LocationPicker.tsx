import { MapPin, Search } from 'lucide-react';
import { EventData } from '@clubhive/shared';

interface LocationPickerProps {
    event: EventData;
    onEventChange: (event: EventData) => void;
}

export function LocationPicker({ event, onEventChange }: LocationPickerProps) {
    const suggestedLocations = [
        'Price Center',
        'Geisel Library',
        'RIMAC Arena',
        'PC Theatre',
        'Student Services Center',
        'Warren Lecture Hall',
        'Peterson Hall',
        'Center Hall',
    ];

    return (
        <div className="bg-surface rounded-lg shadow p-8 border border-outline-variant min-h-[600px]">
            <h4 className="text-xl font-semibold text-on-surface mb-6">Location Picker</h4>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">Search Location</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
                        <input
                            type="text"
                            value={event.location}
                            onChange={e => onEventChange({ ...event, location: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface"
                            placeholder="Search for a location..."
                        />
                    </div>
                </div>

                <div>
                    <h5 className="text-lg font-medium text-on-surface mb-3">Suggested Campus Locations</h5>
                    <div className="grid grid-cols-2 gap-3">
                        {suggestedLocations.map(location => (
                            <button
                                key={location}
                                onClick={() => onEventChange({ ...event, location })}
                                className={`flex items-center p-3 border rounded-lg text-left transition-colors cursor-pointer hover:bg-surface-variant ${
                                    event.location === location
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-outline-variant text-on-surface'
                                }`}
                            >
                                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="truncate">{location}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-surface-variant/50 rounded-lg p-4">
                    <h6 className="font-medium text-on-surface mb-2">Interactive Map (Coming Soon)</h6>
                    <p className="text-sm text-on-surface-variant">
                        An interactive campus map will be available here to help you select the perfect location for your event.
                    </p>
                </div>
            </div>
        </div>
    );
}
