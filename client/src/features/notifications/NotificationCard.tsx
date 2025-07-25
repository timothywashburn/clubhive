import React from 'react';

interface NotificationCardProps {
    club: string;
    title: string;
    date: string;
    read: boolean;
    selected: boolean;
    onClick: () => void;
}

export function NotificationCard({ club, title, date, read, selected = false, onClick }: NotificationCardProps) {
    return (
        <div
            onClick={onClick}
            className={`w-full p-3 rounded-lg text-left transition-all mb-1 cursor-pointer border-l-4 ${
                selected
                    ? 'bg-primary-container border-primary text-on-primary-container'
                    : 'hover:bg-surface-variant/50 border-transparent hover:border-primary/50 text-on-surface'
            }`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${read ? 'bg-outline-variant' : 'bg-orange-500'}`} />
                        <div className="font-normal text-med capitalize">{club}</div>
                    </div>
                    <div className="pl-4 text-sm font-light italic text-on-surface-variant">{title}</div>
                </div>
                <div className="text-sm text-on-surface-variant whitespace-nowrap">{date}</div>
            </div>
        </div>
    );
}
