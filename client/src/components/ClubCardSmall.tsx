import React from 'react';

type ClubCardProps = {
    name: string;
    description: string;
    members: number;
    isSelected: boolean;
    onClick: () => void;
};

const ClubCardSmall: React.FC<ClubCardProps> = ({
    name,
    description,
    members,
    isSelected,
    onClick,
}) => {
    return (
        <div
            className={`p-4 border rounded-md cursor-pointer transition-transform transition-shadow duration-200 hover:shadow-lg hover:-translate-y-1 ${
                isSelected
                    ? ' border-orange-500'
                    : 'bg-surface border-outline-variant'
            }`}
            onClick={onClick}
        >
            <h3 className="text-lg text-on-surface font-medium">{name}</h3>
            <p className="text-sm text-on-surface-variant">{members} members</p>
            <p className="text-on-surface-variant mt-2">{description}</p>
        </div>
    );
};

export default ClubCardSmall;
