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
            className={`p-4 border rounded-md cursor-pointer ${
                isSelected
                    ? 'bg-orange-100 border-orange-500'
                    : 'bg-white border-gray-300'
            }`}
            onClick={onClick}
        >
            <h3 className="text-lg font-medium">{name}</h3>
            <p className="text-sm text-gray-500">{members} members</p>
            <p className="text-gray-600 mt-2">{description}</p>
        </div>
    );
};

export default ClubCardSmall;
