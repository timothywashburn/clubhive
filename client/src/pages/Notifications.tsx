import { useState, useEffect } from 'react';
import { NotificationCard } from '../features/notifications/NotificationCard.tsx';
import { NotifExpanded } from '../features/notifications/NotifExpanded.tsx';

export function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [selected, setSelected] = useState<number | null>(null);
    const selectedNotification = notifications.find(n => n._id === selected);

    const userId = '68827dbf0b88d24e410fcf91';

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/notifications/${userId}`);
                const data = await res.json();

                if (data.success) {
                    setNotifications(data.notifications);
                } else {
                    // eslint-disable-next-line no-console
                    console.log('Failed to fetch notifications');
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.log('Error fetching notifications:', err);
            }
        })();
    }, [userId]);

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
                                    key={notification._id}
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
