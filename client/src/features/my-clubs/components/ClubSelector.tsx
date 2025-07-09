import { Crown, Shield, Search } from 'lucide-react';
import { useNavigate } from 'react-router';
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
    const navigate = useNavigate();

    return (
        <div className="bg-surface rounded-lg shadow border border-outline-variant h-fit">
            <div className="p-4 border-b border-outline-variant">
                <h2 className="text-lg font-semibold text-on-surface">
                    My Clubs
                </h2>
            </div>
            <div className="p-2">
                {clubs.length === 0 && (
                    <button
                        onClick={() => navigate('/clubs')}
                        className="w-full p-3 rounded-lg text-left transition-all mb-1 group cursor-pointer hover:bg-surface-variant/50 border-dashed border-2 border-outline-variant"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-primary/10 text-primary border-2 border-dashed border-primary/30">
                                <Search className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-on-surface truncate pr-2">
                                    Find clubs to join
                                </h3>
                                <p className="text-xs text-on-surface-variant truncate italic">
                                    Discover communities near you
                                </p>
                            </div>
                        </div>
                    </button>
                )}
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
                            className={`w-full p-3 rounded-lg text-left transition-all mb-1 group cursor-pointer ${
                                selectedClub?.id === club.id
                                    ? 'bg-primary-container border-l-4 border-primary'
                                    : 'hover:bg-surface-variant/50 hover:border-l-4 border-primary/50'
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
