/**
 * THIS CLASS IS AI GENERATED AND TEMPORARY
 *
 * This class is a placeholder that bears no resemblance to the real
 * implementation for this page. This code is temporary and can be
 * replaced by the real implementation at any time.
 */
export function Notifications() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-on-surface">
                        Notifications
                    </h1>
                    <p className="text-on-surface-variant mt-2">
                        Stay updated with your club activities
                    </p>
                </div>

                <div className="bg-surface rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-outline-variant">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium text-on-surface">
                                Recent Activity
                            </h2>
                            <button className="text-sm text-primary hover:text-primary/90">
                                Mark all as read
                            </button>
                        </div>
                    </div>
                    <div className="divide-y divide-outline-variant">
                        {/* Placeholder notifications */}
                        {[
                            {
                                type: 'event',
                                message:
                                    'New event: Club Meeting tomorrow at 7 PM',
                                time: '2 hours ago',
                                unread: true,
                            },
                            {
                                type: 'club',
                                message:
                                    'You were accepted into Photography Club',
                                time: '1 day ago',
                                unread: true,
                            },
                            {
                                type: 'reminder',
                                message:
                                    'Reminder: Soccer practice today at 5 PM',
                                time: '2 days ago',
                                unread: false,
                            },
                            {
                                type: 'announcement',
                                message: 'New announcement from Drama Club',
                                time: '3 days ago',
                                unread: false,
                            },
                        ].map((notification, i) => (
                            <div
                                key={i}
                                className={`px-6 py-4 ${notification.unread ? 'bg-primary/10' : ''}`}
                            >
                                <div className="flex items-start">
                                    <div
                                        className={`w-2 h-2 rounded-full mt-2 mr-3 ${notification.unread ? 'bg-primary' : 'bg-outline-variant'}`}
                                    />
                                    <div className="flex-1">
                                        <p className="text-on-surface">
                                            {notification.message}
                                        </p>
                                        <p className="text-sm text-on-surface-variant mt-1">
                                            {notification.time}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
