import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationCard } from '../features/notifications/NotificationCard.tsx';
import { NotifExpanded } from '../features/notifications/NotifExpanded.tsx';
import { useNotifs } from '../hooks/fetchNotifs.tsx';
import { useNavigate } from 'react-router';

export function Notifications() {
    const navigate = useNavigate();

    const [selected, setSelected] = useState<string | null>(null);

    const { notifs, setNotifs, isLoading, error } = useNotifs();

    const markAsRead = async (userNotifId: string) => {
        try {
            const res = await fetch(`/api/notifications/mark-read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notificationId: userNotifId }),
            });

            const data = await res.json();
            if (data.success) {
                setNotifs(prev => prev.map(n => (n.userNotifId === userNotifId ? { ...n, read: true } : n)));
            } else {
                // eslint-disable-next-line no-console
                console.error('Failed to mark notification as read:', data.error);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to mark notification as read:', err);
        }
    };

    const selectedNotification = notifs.find(n => n._id === selected);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div className="h-full relative">
            <div className="w-full py-8">
                <div className="mb-8 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-on-surface">Notifications</h1>
                    <p className="text-on-surface-variant mt-2">Stay updated with your club activities</p>
                </div>

                <div className="flex gap-6 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-200px)]">
                    <motion.div
                        className="bg-surface rounded-lg shadow border border-outline-variant flex flex-col h-fit w-1/3"
                        initial={{ x: '100%' }}
                        animate={{
                            x: selected ? '0%' : '100%',
                        }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="px-6 py-4 border-b border-outline-variant flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-on-surface">Recent Activity</h2>
                                <button
                                    className="text-sm text-primary hover:text-primary/90 cursor-pointer"
                                    onClick={() => {
                                        notifs.forEach(n => {
                                            if (!n.read) {
                                                void markAsRead(n.userNotifId);
                                            }
                                        });
                                    }}
                                >
                                    Mark all as read
                                </button>
                            </div>
                        </div>

                        <div className="p-2 space-y-2">
                            {notifs.map(notification => (
                                <NotificationCard
                                    key={notification._id}
                                    club={notification.clubName}
                                    title={notification.title}
                                    date={notification.date}
                                    read={notification.read}
                                    selected={selected === notification._id}
                                    onClick={() => {
                                        setSelected(notification._id);
                                        if (!notification.read) {
                                            void markAsRead(notification.userNotifId);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                        <div className="p-4">
                            <button
                                onClick={() => navigate('/send-notification')}
                                className="bg-primary text-on-primary px-4 py-2 w-full rounded-md font-medium shadow-sm hover:bg-primary/90 transition"
                            >
                                Send Notification
                            </button>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {selected && (
                            <motion.div
                                className="flex-1 min-w-0 h-full overflow-y-auto"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.2 }}
                            >
                                <NotifExpanded notification={selectedNotification} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
