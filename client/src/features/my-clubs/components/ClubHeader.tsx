import { Eye } from 'lucide-react';
import { Club } from '../types';
import { useMyClubsData } from '../hooks';

interface ClubHeaderProps {
    club: Club;
    isOfficer: boolean;
    isPreviewMode: boolean;
    onPreviewToggle: () => void;
}

export function ClubHeader({
    club,
    isOfficer,
    isPreviewMode,
    onPreviewToggle,
}: ClubHeaderProps) {
    const { getClubColors } = useMyClubsData();

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${getClubColors(club.id)}`}
                >
                    {club.name
                        .split(' ')
                        .map(word => word[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-on-surface">
                        {club.name}
                    </h2>
                    <p className="text-on-surface-variant text-sm italic">
                        {club.tagline}
                    </p>
                </div>
            </div>
            {isOfficer && (
                <button
                    onClick={onPreviewToggle}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-primary text-on-primary hover:bg-primary/90`}
                >
                    <Eye className="w-4 h-4 mr-2" />
                    {isPreviewMode ? 'Exit Preview' : 'Preview'}
                </button>
            )}
        </div>
    );
}
