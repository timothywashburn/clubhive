import React from 'react';
import { useImageData } from '../hooks/getImageFile';

interface ClubLogoProps {
    clubLogo?: string | null;
    clubName?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-lg',
};

const getClubInitials = (clubName?: string) => {
    if (!clubName) return '?';
    return clubName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// Simple color generation based on club name
const getClubColor = (clubName?: string) => {
    if (!clubName) return 'bg-gray-400 text-white';

    const colors = [
        'bg-red-400 text-white',
        'bg-blue-400 text-white',
        'bg-green-400 text-white',
        'bg-yellow-400 text-black',
        'bg-purple-400 text-white',
        'bg-pink-400 text-white',
        'bg-indigo-400 text-white',
        'bg-teal-400 text-white',
    ];

    const hash = clubName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
};

export function ClubLogo({ clubLogo, clubName, size = 'md', className = '' }: ClubLogoProps) {
    const { image, loading, error } = useImageData(clubLogo || null);

    const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${className}`;

    if (clubLogo && image && !loading && !error) {
        return <img src={image.url} alt={`${clubName} logo`} className={`${baseClasses} object-cover`} />;
    }

    // Fallback to colored initials
    const colorClass = getClubColor(clubName);
    const initials = getClubInitials(clubName);

    return <div className={`${baseClasses} ${colorClass}`}>{initials}</div>;
}
