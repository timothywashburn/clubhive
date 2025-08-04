import { Trash2 } from 'lucide-react';
import { EventData } from '@clubhive/shared';

interface DangerZoneProps {
    event: EventData;
    onDelete: () => void;
    isDeleteLoading?: boolean;
}

export function DangerZone({ event, onDelete, isDeleteLoading = false }: DangerZoneProps) {
    return (
        <div className="bg-surface rounded-lg shadow p-6 border border-error/20 mt-6">
            <h4 className="text-lg font-semibold text-error mb-4">Danger Zone</h4>
            <div className="flex items-center justify-between">
                <div>
                    <h5 className="font-medium text-on-surface mb-1">Delete Event</h5>
                    <p className="text-sm text-on-surface-variant">
                        Once you delete this event, there is no going back. Please be certain.
                    </p>
                </div>
                <button
                    onClick={onDelete}
                    disabled={isDeleteLoading}
                    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-error text-on-error hover:bg-error/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleteLoading ? 'Deleting...' : 'Delete Event'}
                </button>
            </div>
        </div>
    );
}
