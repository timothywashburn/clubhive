import { Search, RefreshCw } from 'lucide-react';

interface AdminToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    showCreateButton?: boolean;
    createButtonText?: string;
    onCreateClick?: () => void;
    onRefresh?: () => void;
    isRefreshing?: boolean;
    additionalActions?: React.ReactNode;
}

export function AdminToolbar({
    searchValue,
    onSearchChange,
    showCreateButton = false,
    createButtonText = 'Create',
    onCreateClick,
    onRefresh,
    isRefreshing = false,
    additionalActions,
}: AdminToolbarProps) {
    return (
        <div className="bg-surface rounded-lg shadow p-4 border border-outline-variant">
            <div className="flex items-center justify-between gap-4">
                {/* Search */}
                <div className="flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={e => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-surface text-on-surface placeholder-on-surface-variant"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className="px-3 py-2 border border-outline-variant text-on-surface rounded-lg hover:bg-surface-variant transition-colors font-medium text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    )}
                    {additionalActions}
                    {showCreateButton && (
                        <button
                            onClick={onCreateClick}
                            className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm cursor-pointer"
                        >
                            {createButtonText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
