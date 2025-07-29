import { Users, Calendar, BarChart3, User, FileText, MapPin, Zap, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabType, TabItem } from '../types';
import { EventData } from '@clubhive/shared';

interface TabNavigationProps {
    showOfficerView: boolean;
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    indicatorStyle: { left: number; width: number };
    shouldAnimate: boolean;
    tabRefs: React.MutableRefObject<{
        [key: string]: HTMLButtonElement | null;
    }>;
    setShouldAnimate: (animate: boolean) => void;
    selectedEvent?: EventData | null;
}

export function TabNavigation({
    showOfficerView,
    activeTab,
    onTabChange,
    indicatorStyle,
    shouldAnimate,
    tabRefs,
    setShouldAnimate,
    selectedEvent,
}: TabNavigationProps) {
    const getMemberTabs = (): TabItem[] => [
        { key: 'membership', label: 'My Membership', icon: User },
        { key: 'info', label: 'Info', icon: Users },
        { key: 'events', label: 'Events', icon: Calendar },
    ];

    const getOfficerTabs = (): TabItem[] => [
        { key: 'membership', label: 'My Membership', icon: User },
        { key: 'info', label: 'Edit Info', icon: Users },
        { key: 'events', label: 'Event Planner', icon: Calendar },
        { key: 'stats', label: 'Stats', icon: BarChart3 },
    ];

    const getEventEditTabs = (): TabItem[] => [
        { key: 'event-details', label: 'Details', icon: FileText },
        { key: 'event-location', label: 'Location Picker', icon: MapPin },
        { key: 'event-tap', label: 'TAP (WIP)', icon: Zap },
        { key: 'event-funding', label: 'AS Funding (WIP)', icon: DollarSign },
    ];

    const tabs = selectedEvent ? getEventEditTabs() : showOfficerView ? getOfficerTabs() : getMemberTabs();

    return (
        <div className="border-b border-outline-variant">
            <nav className="flex justify-between relative overflow-hidden">
                <div className="flex space-x-8">
                    {(selectedEvent ? tabs : tabs.filter(tab => tab.key !== 'membership')).map(tab => {
                        const Icon = tab.icon;
                        return (
                            <motion.button
                                key={tab.key}
                                ref={(el: HTMLButtonElement | null) => {
                                    tabRefs.current[tab.key] = el;
                                }}
                                onClick={() => {
                                    setShouldAnimate(true);
                                    onTabChange(tab.key);
                                }}
                                className={`flex items-center py-3 px-1 font-medium text-sm transition-colors cursor-pointer relative ${
                                    activeTab === tab.key ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                                layout
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {tab.label}
                            </motion.button>
                        );
                    })}
                </div>
                {!selectedEvent && (
                    <div>
                        <AnimatePresence>
                            {tabs
                                .filter(tab => tab.key === 'membership')
                                .map(tab => {
                                    const Icon = tab.icon;
                                    return (
                                        <motion.button
                                            key={tab.key}
                                            ref={(el: HTMLButtonElement | null) => {
                                                tabRefs.current[tab.key] = el;
                                            }}
                                            onClick={() => {
                                                setShouldAnimate(true);
                                                onTabChange(tab.key);
                                            }}
                                            className={`flex items-center py-3 px-1 font-medium text-sm transition-colors cursor-pointer relative ${
                                                activeTab === tab.key ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                                            }`}
                                            initial={{ opacity: 0, y: -20, scale: 0.8 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ 
                                                opacity: 0, 
                                                y: 50, 
                                                scale: 0.8,
                                                transition: { duration: 0.2, ease: "easeIn" }
                                            }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                        >
                                            <Icon className="w-4 h-4 mr-2" />
                                            {tab.label}
                                        </motion.button>
                                    );
                                })}
                        </AnimatePresence>
                    </div>
                )}
                <div
                    className={`absolute bottom-0 h-0.5 bg-primary ${shouldAnimate ? 'transition-all duration-300 ease-in-out' : ''}`}
                    style={{
                        left: `${indicatorStyle.left}px`,
                        width: `${indicatorStyle.width}px`,
                    }}
                />
            </nav>
        </div>
    );
}
