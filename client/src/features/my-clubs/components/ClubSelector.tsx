import { Crown, Shield } from 'lucide-react';
import { Club } from '../types';
import { useMyClubsData } from '../hooks';

interface ClubSelectorProps {
    clubs: Club[];
    selectedClub: Club | null;
    onClubSelect: (club: Club) => void;
}

export function ClubSelector({
    clubs,
    selectedClub,
    onClubSelect,
}: ClubSelectorProps) {
    const { getClubColors } = useMyClubsData();

    return (
        <div className="bg-surface rounded-lg shadow border border-outline-variant h-fit">
            <div className="p-4 border-b border-outline-variant">
                <h2 className="text-lg font-semibold text-on-surface">
                    My Clubs
                </h2>
            </div>
            <div className="p-2">
                {clubs.map(club => {
                    const clubInitials = club.name
                        .split(' ')
                        .map(word => word[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                    return (
                        <button
                            key={club.id}
                            onClick={() => onClubSelect(club)}
                            className={`w-full p-3 rounded-lg text-left transition-all hover:bg-surface-variant/50 mb-1 group cursor-pointer ${
                                selectedClub?.id === club.id
                                    ? 'bg-primary-container border-l-4 border-primary'
                                    : 'hover:border-l-4 border-primary/50'
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${getClubColors(club.id)}`}
                                >
                                    {clubInitials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-on-surface truncate pr-2">
                                        {club.name}
                                    </h3>
                                    <p className="text-xs text-on-surface-variant truncate italic">
                                        {club.tagline}
                                    </p>
                                </div>
                                {club.role === 'owner' && (
                                    <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                )}
                                {club.role === 'officer' && (
                                    <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
