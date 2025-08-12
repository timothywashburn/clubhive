import { ComponentType } from 'react';
import { EventData } from '@clubhive/shared';

// Base tab item interface
export interface NavigationItem {
    key: string;
    label: string;
    to?: string; // For site navigation (routing)
    icon?: ComponentType<{ className?: string }>;
    onClick?: () => void; // For tab navigation (callbacks)
}

// Site navigation specific types
export type SiteNavType = 'regular' | 'admin';

export interface SiteNavigationConfig {
    navType: 'site';
    siteNavType: SiteNavType;
    isAuthenticated: boolean;
    //toggleAuth: () => void;
    toggleSiteNavType?: () => void;
    activeRoute: string;
}

// Tab navigation specific types
export type TabType =
    | 'membership'
    | 'info'
    | 'events'
    | 'planner'
    | 'stats'
    | 'event-details'
    | 'event-location'
    | 'event-tap'
    | 'event-funding';

export interface TabNavigationConfig {
    navType: 'tabs';
    showOfficerView: boolean;
    selectedEvent?: EventData | null;
    showStatsTab: boolean;
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    contextId?: string; // For tracking context changes
    isPreviewMode?: boolean;
}

// Unified props
export type UnifiedNavigationProps = SiteNavigationConfig | TabNavigationConfig;

// Style configuration
export interface NavigationStyle {
    showBorder?: boolean;
    variant?: 'default' | 'about-page';
    className?: string;
}
