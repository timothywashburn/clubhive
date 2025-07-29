import { Eye, Save, X } from 'lucide-react';
import { UserClubData, EventData } from '@clubhive/shared';
import { useMyClubsData } from '../hooks';

interface ClubHeaderProps {
    club: UserClubData;
    isOfficer: boolean;
    isPreviewMode: boolean;
    onPreviewToggle: () => void;
    selectedEvent?: EventData | null;
    onEventSave?: () => void;
    onEventCancel?: () => void;
}

export function ClubHeader({
    club,
    isOfficer,
    isPreviewMode,
    onPreviewToggle,
    selectedEvent,
    onEventSave,
    onEventCancel,
}: ClubHeaderProps) {
    const { getClubColors } = useMyClubsData();

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${getClubColors(club._id)}`}>
                    {club.name
                        .split(' ')
                        .map(word => word[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-semibold text-on-surface">{club.name}</h2>
                        {selectedEvent && (
                            <>
                                <span className="text-on-surface-variant text-xl">→</span>
                                <div className="club-header-event-target bg-primary text-on-primary px-3 py-2 rounded-lg font-medium text-sm" style={{ opacity: 0 }}>
                                    {selectedEvent.name}
                                </div>
                            </>
                        )}
                    </div>
                    <p className="text-on-surface-variant text-sm italic">{club.tagline}</p>
                </div>
            </div>
            {isOfficer && (
                <div className="flex items-center gap-2">
                    {selectedEvent ? (
                        <>
                            <button
                                onClick={onEventSave}
                                className="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-primary text-on-primary hover:bg-primary/90"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </button>
                            <button
                                onClick={onEventCancel}
                                className="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-outline-variant text-on-surface hover:bg-surface-variant"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onPreviewToggle}
                            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-primary text-on-primary hover:bg-primary/90`}
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            {isPreviewMode ? 'Exit Preview' : 'Preview'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
