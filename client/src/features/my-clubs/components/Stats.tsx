import { Club } from '../types';

interface StatsProps {
    club: Club;
}

export function Stats({ club }: StatsProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                    <h3 className="text-lg font-medium text-on-surface mb-2">
                        Total Members
                    </h3>
                    <p className="text-3xl font-bold text-primary">
                        {club.memberCount}
                    </p>
                </div>
                <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                    <h3 className="text-lg font-medium text-on-surface mb-2">
                        Events This Month
                    </h3>
                    <p className="text-3xl font-bold text-primary">8</p>
                </div>
                <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                    <h3 className="text-lg font-medium text-on-surface mb-2">
                        Avg. Attendance
                    </h3>
                    <p className="text-3xl font-bold text-primary">45</p>
                </div>
            </div>
            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <h3 className="text-lg font-medium text-on-surface mb-4">
                    Member Activity
                </h3>
                <div className="h-64 bg-surface-variant/50 rounded-lg flex items-center justify-center">
                    <p className="text-on-surface-variant">
                        Chart visualization would go here
                    </p>
                </div>
            </div>
        </div>
    );
}
