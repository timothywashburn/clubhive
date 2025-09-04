import { VenueAvailability, VenueFilterType } from './types';
import { VenueDisplayCard } from './VenueDisplayCard';

interface VenueCardProps {
    venue: VenueAvailability;
    isSelected: boolean;
    onSelect: (venue: VenueAvailability) => void;
    filters?: VenueFilterType;
}

export function VenueCard({ venue, isSelected, onSelect, filters }: VenueCardProps) {
    return (
        <VenueDisplayCard
            venue={venue}
            isSelected={isSelected}
            onSelect={onSelect}
            filters={filters}
            mode="daily"
            availabilityHeight={160}
            showSummary={true}
        />
    );
}
