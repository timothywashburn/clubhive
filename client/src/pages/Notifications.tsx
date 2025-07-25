import { NotificationCard } from '../features/notifications/NotificationCard.tsx';
import { useState } from 'react';
import { NotifExpanded } from '../features/notifications/NotifExpanded.tsx';

const notifications = [
    {
        _id: 1,
        club: 'Computer Science Club',
        title: 'Meeting Location Changed',
        body:
            'Attention all members: the Computer Science Club meeting location has been changed for this week. New ' +
            'Location: Room 204, Engineering Building Date and Time: Thursday at 5:00 PM (same time as usual) Please ' +
            "make sure to go to the updated room. We'll still have our regular activities, updates on upcoming projects, " +
            'and time to connect with fellow members. Looking forward to seeing you there.',
        date: '2025-07-15',
        read: false,
    },
    {
        _id: 2,
        club: 'Photography Society',
        title: 'Sign up for new event',
        body:
            'Attention all members: the Computer Science Club meeting location has been changed for this week. New ' +
            'Location: Room 204, Engineering Building Date and Time: Thursday at 5:00 PM (same time as usual) Please ' +
            "make sure to go to the updated room. We'll still have our regular activities, updates on upcoming projects, " +
            'and time to connect with fellow members. Looking forward to seeing you there.',
        date: '2025-07-15',
        read: false,
    },
];

export function Notifications() {
    const [selected, setSelected] = useState<number | null>(null);
    const selectedNotification = notifications.find(n => n._id === selected);

    return (
        <div className="h-full relative">
            <div className="w-full py-8">
                <div className="mb-8 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-on-surface">Notifications</h1>
                    <p className="text-on-surface-variant mt-2">Stay updated with your club activities</p>
                </div>

                <div className="flex gap-6 px-4 sm:px-6 lg:px-8">
                    <div className="w-1/3 bg-surface rounded-lg shadow border border-outline-variant">
                        <div className="px-6 py-4 border-b border-outline-variant">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-on-surface">Recent Activity</h2>
                                <button className="text-sm text-primary hover:text-primary/90">Mark all as read</button>
                            </div>
                        </div>
                        <div className="p-2 space-y-2">
                            {notifications.map(notification => (
                                <NotificationCard
                                    club={notification.club}
                                    title={notification.title}
                                    date={notification.date}
                                    read={notification.read}
                                    selected={selected === notification._id}
                                    onClick={() => setSelected(notification._id)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <NotifExpanded notification={selectedNotification} />
                    </div>
                </div>
            </div>
        </div>
    );
}
