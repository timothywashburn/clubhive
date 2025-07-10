import { Users } from 'lucide-react';

export function EmptyState() {
    return (
        <div className="bg-surface rounded-lg shadow border border-outline-variant flex items-center justify-center h-96">
            <div className="text-center">
                <Users className="mx-auto h-16 w-16 text-on-surface-variant mb-6" />
                <h3 className="text-xl font-medium text-on-surface mb-3">
                    Select a club to view details
                </h3>
                <p className="text-on-surface-variant">
                    Choose a club from the list to see information, events, and
                    more.
                </p>
            </div>
        </div>
    );
}
