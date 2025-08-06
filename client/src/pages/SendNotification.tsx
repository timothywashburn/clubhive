export function SendNotification() {
    const scheduled = [
        {
            club: 'Computer Science Club',
            title: 'Meeting Location Changed',
            time: 'in 1 day',
        },
        {
            club: 'Photography Society',
            title: 'Sign up for new event',
            time: 'in 2 days',
        },
    ];

    return (
        <div className="h-full relative">
            <div className="w-full py-8">
                <div className="mb-8 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-on-surface">Send Notifications</h1>
                    <p className="text-on-surface-variant mt-2">Plan and send announcements to members of your clubs</p>
                </div>

                <div className="flex gap-6 px-4 sm:px-6 lg:px-8">
                    <div className="w-1/3 bg-surface rounded-lg shadow border border-outline-variant">
                        <div className="px-6 py-4 border-b border-outline-variant">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-on-surface">Scheduled Announcements</h2>
                            </div>
                        </div>

                        <div className="p-2 space-y-2">
                            {scheduled.map((item, index) => (
                                <div
                                    key={index}
                                    className="w-full rounded-md border border-outline-variant bg-surface p-4 shadow-sm hover:bg-surface-variant transition"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-on-surface font-medium text-base capitalize">{item.club}</div>
                                            <div className="text-sm italic text-on-surface-variant mt-1">{item.title}</div>
                                        </div>
                                        <div className="text-sm text-on-surface-variant whitespace-nowrap">{item.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0"></div>
                </div>
            </div>
        </div>
    );
}
