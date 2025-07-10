import { useState, useEffect } from 'react';
import { Club, TabType } from '../types';

export const useClubState = () => {
    const [selectedClub, setSelectedClub] = useState<Club | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('membership');
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const isOfficer =
        selectedClub?.role === 'officer' || selectedClub?.role === 'owner';
    const isOwner = selectedClub?.role === 'owner';
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
