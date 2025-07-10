import React from 'react';
import { useMyClubsData } from '../features/my-clubs/hooks';
const { getClubColors } = useMyClubsData();

type ClubCardProps = {
    name: string;
    tagline: string;
    members: number;
    id: string;
    isSelected: boolean;
    onClick: () => void;
};

const ClubCardSmall: React.FC<ClubCardProps> = ({
    name,
    tagline,
    members,
    id,
    isSelected,
    onClick,
}) => {
    const clubInitials = name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    return (
        <div
            className={`p-4 border rounded-md cursor-pointer transition-transform transition-shadow duration-200 hover:shadow-lg hover:-translate-y-1 ${
                isSelected
                    ? ' border-primary bg-primary-container'
                    : 'bg-surface border-outline-variant'
            }`}
            onClick={onClick}
        >
            <div className="flex items-center gap-3 mb-2">
                <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-semibold ${getClubColors(id)}`}
                >
                    {clubInitials}
                </div>
                <div className="flex-1 overflow-hidden">
                    <h3 className="text-lg text-on-surface font-medium truncate">
                        {name}
                    </h3>

                    <p className="text-sm text-on-surface-variant">
                        {members} members
                    </p>
                    <p className="text-sm text-on-surface-variant mt-2 truncate italic">
                        {tagline}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ClubCardSmall;
