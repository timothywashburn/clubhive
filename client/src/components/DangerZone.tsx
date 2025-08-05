import { Trash2, AlertTriangle } from 'lucide-react';
import React from 'react';

interface DangerZoneAction {
    label: string;
    description?: string; // Individual description per action
    onClick: () => void;
    isLoading?: boolean;
    loadingText?: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface DangerZoneProps {
    title?: string;
    description?: string; // Global description (fallback if action doesn't have one)
    actions: DangerZoneAction[];
    headerIcon?: React.ComponentType<{ className?: string }>;
}

export function DangerZone({
    title = 'Danger Zone',
    description = 'Actions in this section are irreversible. Please be certain.',
    actions,
    headerIcon: HeaderIcon = AlertTriangle,
}: DangerZoneProps) {
    return (
        <div className="bg-surface rounded-lg shadow border border-error/40 mt-6">
            <div className="px-6 py-4 border-b border-error/40">
                <h2 className="text-lg font-medium text-on-surface flex items-center gap-2">
                    <HeaderIcon className="w-5 h-5 text-error" />
                    {title}
                </h2>
            </div>
            <div className="px-6 py-6">
                <div className="space-y-4">
                    {actions.map((action, index) => (
                        <React.Fragment key={index}>
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-on-surface mb-1">{action.label}</h5>
                                    <p className="text-sm text-on-surface-variant">{action.description || description}</p>
                                </div>
                                <button
                                    onClick={action.onClick}
                                    disabled={action.isLoading}
                                    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-error text-on-error hover:bg-error/90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                                    {action.isLoading ? action.loadingText || 'Loading...' : action.label}
                                </button>
                            </div>
                            {index < actions.length - 1 && <div className="border-t border-outline" />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Convenience component for single delete actions (most common use case)
interface DeleteDangerZoneProps {
    itemName: string;
    itemType?: string;
    onDelete: () => void;
    isDeleteLoading?: boolean;
    customDescription?: string;
    title?: string;
}

export function DeleteDangerZone({
    itemName,
    itemType = 'item',
    onDelete,
    isDeleteLoading = false,
    customDescription,
    title = 'Danger Zone',
}: DeleteDangerZoneProps) {
    return (
        <DangerZone
            title={title}
            actions={[
                {
                    label: `Delete ${itemType}`,
                    onClick: onDelete,
                    isLoading: isDeleteLoading,
                    loadingText: 'Deleting...',
                    icon: Trash2,
                },
            ]}
            description={customDescription || `Once you delete this ${itemType.toLowerCase()}, there is no going back. Please be certain.`}
        />
    );
}
