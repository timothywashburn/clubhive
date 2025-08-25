import React from 'react';
import { Calendar, Bookmark } from 'lucide-react';

interface EmptyEventStateProps {
    type: 'upcoming' | 'saved';
}

export function EmptyEventState({ type }: EmptyEventStateProps) {
    const content = {
        upcoming: {
            icon: Calendar,
            title: 'No upcoming events',
            description: 'Join clubs to see their upcoming events here',
        },
        saved: {
            icon: Bookmark,
            title: 'No saved events',
            description: 'Save events to easily find them later',
        },
    };

    const { icon: Icon, title, description } = content[type];

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <Icon className="w-12 h-12 text-on-surface-variant mb-4" />
            <h3 className="text-lg font-medium text-on-surface mb-2">{title}</h3>
            <p className="text-sm text-on-surface-variant max-w-sm">{description}</p>
        </div>
    );
}
