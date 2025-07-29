import { useState, useEffect } from 'react';
import { UserClubData } from '@clubhive/shared';
import { TabType } from '../types';

export const useClubState = () => {
    const [selectedClub, setSelectedClub] = useState<UserClubData | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('membership');
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const isOfficer = selectedClub?.userRole === 'officer' || selectedClub?.userRole === 'owner';
    const isOwner = selectedClub?.userRole === 'owner';
    const showOfficerView = isOfficer && !isPreviewMode;

    useEffect(() => {
        setIsPreviewMode(false);
        setActiveTab('membership');
    }, [selectedClub]);

    return {
        selectedClub,
        setSelectedClub,
        activeTab,
        setActiveTab,
        isPreviewMode,
        setIsPreviewMode,
        isOfficer,
        isOwner,
        showOfficerView,
    };
};
