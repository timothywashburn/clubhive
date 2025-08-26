export function AdminDashboard() {
    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-on-surface mb-6">Admin Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                        <h2 className="text-xl font-semibold text-on-surface mb-4">Overview</h2>
                        <p className="text-on-surface-variant">Dashboard overview content will go here.</p>
                    </div>
                    <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                        <h2 className="text-xl font-semibold text-on-surface mb-4">Quick Actions</h2>
                        <p className="text-on-surface-variant">Quick actions content will go here.</p>
                    </div>
                    <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                        <h2 className="text-xl font-semibold text-on-surface mb-4">Recent Activity</h2>
                        <p className="text-on-surface-variant">Recent activity content will go here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
