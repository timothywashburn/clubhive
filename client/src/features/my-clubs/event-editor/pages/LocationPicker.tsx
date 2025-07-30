import { EventData } from '@clubhive/shared';
import { VenueAvailabilityPicker } from '../location-picker';

interface LocationPickerProps {
    event: EventData;
    onEventChange: (event: EventData) => void;
}

export function LocationPicker({ event, onEventChange }: LocationPickerProps) {
    return <VenueAvailabilityPicker event={event} onEventChange={onEventChange} />;
}
