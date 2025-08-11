import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { UserClubData } from '@clubhive/shared';
import { TabType } from '../types';

export const useClubState = (clubs: UserClubData[]) => {
    const { clubUrl, tab } = useParams<{ clubUrl: string; tab: string }>();
    const navigate = useNavigate();

    const [selectedClub, setSelectedClub] = useState<UserClubData | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('membership');
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const isOfficer = selectedClub?.userRole === 'officer' || selectedClub?.userRole === 'owner';
    const isOwner = selectedClub?.userRole === 'owner';
    const showOfficerView = isOfficer && !isPreviewMode;

    // Valid tabs for different contexts
    const validMemberTabs: TabType[] = ['membership', 'info', 'events'];
    const validOfficerTabs: TabType[] = ['membership', 'info', 'events', 'stats'];
    const validEventTabs: TabType[] = ['event-details', 'event-location', 'event-tap', 'event-funding'];
    const urlTabs: TabType[] = [...validMemberTabs, 'stats']; // Only these tabs appear in URL

    // Find club by URL parameter
    useEffect(() => {
        if (clubUrl && clubs.length > 0) {
            const club = clubs.find(c => c.url === clubUrl);
            if (club && club !== selectedClub) {
                setSelectedClub(club);
            }
        } else if (!clubUrl) {
            setSelectedClub(null);
        }
    }, [clubUrl, clubs, selectedClub]);

    // Set active tab from URL parameter
    useEffect(() => {
        if (tab && selectedClub) {
            const validTabs = showOfficerView ? validOfficerTabs : validMemberTabs;

            if (urlTabs.includes(tab as TabType) && validTabs.includes(tab as TabType)) {
                setActiveTab(tab as TabType);
            } else {
                // Invalid tab, redirect to default
                const defaultTab = 'membership';
                navigate(`/my-clubs/${selectedClub.url}/${defaultTab}`, { replace: true });
            }
        } else if (selectedClub && !tab) {
            // No tab specified, redirect to default
            const defaultTab = 'membership';
            setActiveTab(defaultTab);
            navigate(`/my-clubs/${selectedClub.url}/${defaultTab}`, { replace: true });
        } else if (!selectedClub && !clubUrl) {
            // No club selected, default state
            setActiveTab('membership');
        }
    }, [tab, selectedClub, showOfficerView, navigate]);

    // Reset preview mode when club changes
    useEffect(() => {
        setIsPreviewMode(false);
    }, [selectedClub]);

    const handleClubSelect = (club: UserClubData | null) => {
        if (club) {
            navigate(`/my-clubs/${club.url}/membership`);
        } else {
            navigate('/my-clubs');
        }
    };

    const handleTabChange = (newTab: TabType) => {
        if (selectedClub) {
            // Event editing tabs don't change URL, only local state
            if (validEventTabs.includes(newTab)) {
                setActiveTab(newTab);
            } else if (urlTabs.includes(newTab)) {
                // Regular tabs update URL
                navigate(`/my-clubs/${selectedClub.url}/${newTab}`);
            }
        }
    };

    const returnToEvents = () => {
        if (selectedClub) {
            navigate(`/my-clubs/${selectedClub.url}/events`);
        }
    };

    return {
        selectedClub,
        setSelectedClub: handleClubSelect,
        activeTab,
        setActiveTab: handleTabChange,
        setActiveTabDirect: setActiveTab, // Direct state setter for internal use
        isPreviewMode,
        setIsPreviewMode,
        isOfficer,
        isOwner,
        showOfficerView,
        returnToEvents,
    };
};
