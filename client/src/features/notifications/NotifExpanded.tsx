import React from 'react';
import { BellRing } from 'lucide-react';
import { useImageData } from '../../hooks/useImageData';

interface NotifExpandedProps {
    notification: {
        title: string;
        club: string;
        date: string;
        body: string;
        clubName: string;
        pictures?: string[];
    } | null;
}

function NotificationImage({ imageId }: { imageId: string }) {
    const { image, loading } = useImageData(imageId);

    if (loading || !image) {
        return <div className="h-24 w-24 bg-outline-variant/10 rounded-md flex-shrink-0" />;
    }

    return <img src={image.url} alt="Notification image" className="h-24 w-24 object-cover rounded-md flex-shrink-0" />;
}

export function NotifExpanded({ notification }: NotifExpandedProps) {
    if (!notification) {
        return <div className="text-on-surface-variant text-sm italic pt-12 text-center">Select a notification to view details</div>;
    }

    const initials = notification.clubName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const day = new Date(notification.date);

    const formatted = `${(day.getMonth() + 1).toString().padStart(2, '0')}-${day.getDate().toString().padStart(2, '0')}-${day.getFullYear()}`;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between  rounded-lg px-4 py-3 bg-surface border border-outline-variant">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-container font-semibold flex items-center justify-center">
                        {initials}
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-on-surface">{notification.clubName}</h2>
                        <div className="flex items-center gap-2 text-on-surface-variant text-sm italic mt-0.5">
                            <BellRing className="w-4 h-4" />
                            {notification.title}
                        </div>
                    </div>
                </div>
                <div className="text-sm text-on-surface-variant whitespace-nowrap">{formatted}</div>
            </div>

            <div className="bg-surface rounded-lg p-6 space-y-4 border border-outline-variant">
                <p className="text-on-surface text-med whitespace-pre-line">{notification.body}</p>

                {/* Display images in a horizontal line */}
                {notification.pictures && notification.pictures.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto pt-2">
                        {notification.pictures.map(imageId => (
                            <NotificationImage key={imageId} imageId={imageId} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
