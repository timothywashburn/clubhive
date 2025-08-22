import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { BarChart3, Calendar, FileText, MapPin, Menu, Shield, ShieldOff, User, Users, UserX, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from '../navbar/NavLink';
import { useUnifiedIndicator } from './useUnifiedIndicator';
import { NavigationItem, SiteNavigationConfig, TabNavigationConfig, TabType, UnifiedNavigationProps } from './types';
import { useAuthStore } from '../../stores/authStore.ts';

export function UnifiedNavigation(props: UnifiedNavigationProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const { isAuthenticated } = useAuthStore();

    const style = props.style || {};
    const isAboutPage = location.pathname === '/about';
    const variant = style.variant || (isAboutPage ? 'about-page' : 'default');

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Generate navigation items based on type
    const { navigationItems, activeKey, availableKeys, contextId } = useMemo(() => {
        if (props.navType === 'site') {
            return generateSiteNavigation(props as SiteNavigationConfig, location.pathname, isAuthenticated);
        } else {
            return generateTabNavigation(props as TabNavigationConfig);
        }
    }, [props, location.pathname]);

    // Unified indicator hook
    const {
        elementRefs,
        isVisible,
        activeKey: indicatorActiveKey,
        frozenPosition,
        isTransitioning,
    } = useUnifiedIndicator({
        activeKey,
        availableKeys,
        navType: props.navType,
        contextId,
        isPreviewMode: props.navType === 'tabs' ? (props as TabNavigationConfig).isPreviewMode : false,
    });

    if (props.navType === 'site') {
        return renderSiteNavigation({
            props: props as SiteNavigationConfig,
            navigationItems,
            variant,
            isMenuOpen,
            toggleMenu,
            closeMenu,
            elementRefs,
            isVisible,
            indicatorActiveKey,
            frozenPosition,
            isTransitioning,
            style,
        });
    } else {
        return renderTabNavigation({
            props: props as TabNavigationConfig,
            navigationItems,
            elementRefs,
            isVisible,
            indicatorActiveKey,
            frozenPosition,
            style,
        });
    }
}

// Site navigation item generation
function generateSiteNavigation(props: SiteNavigationConfig, currentPath: string, isAuthenticated: boolean) {
    const mainNavItems: NavigationItem[] = [
        ...(isAuthenticated ? [{ key: 'my-clubs', label: 'My Clubs', to: '/my-clubs' }] : []),
        { key: 'clubs', label: 'Find Clubs', to: '/clubs' },
        { key: 'events', label: 'Events', to: '/events' },
    ];

    const adminNavItems: NavigationItem[] = [
        { key: 'schools', label: 'Schools', to: '/admin/schools' },
        { key: 'clubs-admin', label: 'Clubs', to: '/admin/clubs' },
        { key: 'users', label: 'Users', to: '/admin/users' },
    ];

    const authNavItems = isAuthenticated
        ? [
              { key: 'notifications', label: 'Notifications', to: '/notifications' },
              { key: 'account', label: 'Account', to: '/account' },
          ]
        : [
              { key: 'signin', label: 'Sign In', to: '/signin' },
              { key: 'signup', label: 'Create Account', to: '/signup' },
          ];

    const currentNavItems = props.siteNavType === 'admin' ? adminNavItems : mainNavItems;
    const allNavItems = [...currentNavItems, ...authNavItems];

    return {
        navigationItems: { main: currentNavItems, auth: authNavItems, all: allNavItems },
        activeKey: currentPath,
        availableKeys: allNavItems.map(item => item.to!),
        contextId: `site-${props.siteNavType}-${isAuthenticated}`,
    };
}

// Tab navigation item generation
function generateTabNavigation(props: TabNavigationConfig) {
    const getMemberTabs = (): NavigationItem[] => {
        const tabs: NavigationItem[] = [
            { key: 'membership', label: 'My Membership', icon: User },
            { key: 'info', label: 'Info', icon: Users },
            { key: 'events', label: 'Events', icon: Calendar },
        ];
        if (props.showStatsTab) {
            tabs.push({ key: 'stats', label: 'Stats', icon: BarChart3 });
        }
        return tabs;
    };

    const getOfficerTabs = (): NavigationItem[] => [
        { key: 'membership', label: 'My Membership', icon: User },
        { key: 'info', label: 'Edit Info', icon: Users },
        { key: 'events', label: 'Event Planner', icon: Calendar },
        { key: 'stats', label: 'Stats', icon: BarChart3 },
    ];

    const getEventEditTabs = (): NavigationItem[] => [
        { key: 'event-details', label: 'Details', icon: FileText },
        { key: 'event-location', label: 'Location Picker', icon: MapPin },
    ];

    const tabs = props.selectedEvent ? getEventEditTabs() : props.showOfficerView ? getOfficerTabs() : getMemberTabs();

    const allTabs = props.selectedEvent ? tabs : tabs.filter(tab => tab.key !== 'membership');
    const membershipTab = props.selectedEvent ? null : tabs.find(tab => tab.key === 'membership');

    return {
        navigationItems: { main: allTabs, membership: membershipTab ? [membershipTab] : [], all: tabs },
        activeKey: props.activeTab,
        availableKeys: tabs.map(tab => tab.key),
        contextId: props.contextId,
    };
}

// Site navigation renderer
function renderSiteNavigation({
    props,
    navigationItems,
    variant,
    isMenuOpen,
    toggleMenu,
    closeMenu,
    elementRefs,
    isVisible,
    indicatorActiveKey,
    frozenPosition,
    isTransitioning,
    style,
}: any) {
    const navClasses =
        variant === 'about-page'
            ? 'bg-black/20 backdrop-blur-md border-b border-white/10'
            : 'bg-surface shadow-md border-b border-outline-variant';

    return (
        <nav style={{ zIndex: 1 }} className={`${navClasses} flex-shrink-0 ${style.className || ''}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Desktop Navigation */}
                <div className="hidden md:flex justify-between items-center h-16 nav-container relative">
                    {/* Left Content */}
                    <div className="flex items-center space-x-8">
                        <Link
                            to={props.siteNavType === 'admin' ? '/admin/dashboard' : '/'}
                            className="flex items-center text-primary hover:text-primary/90"
                        >
                            <img src="/logo_dark.svg" alt="clubhive" className="h-8" />
                        </Link>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={props.siteNavType}
                                className="flex space-x-6"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50, transition: { duration: 0.2, ease: 'easeIn' } }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                            >
                                {navigationItems.main.map((item: NavigationItem) => (
                                    <NavLink
                                        key={item.key}
                                        to={item.to!}
                                        ref={el => {
                                            elementRefs.current[item.to!] = el;
                                        }}
                                        enableActiveState={true}
                                        className="py-4 px-2"
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Content */}
                    <div className="flex items-center space-x-4">
                        {props.toggleSiteNavType && (
                            <button
                                onClick={props.toggleSiteNavType}
                                className="p-2 rounded-md bg-secondary-container hover:bg-primary-container transition-colors cursor-pointer"
                                title={props.siteNavType === 'admin' ? 'Switch to regular navigation' : 'Switch to admin navigation'}
                            >
                                {props.siteNavType === 'admin' ? (
                                    <Shield size={20} className="text-primary" />
                                ) : (
                                    <ShieldOff size={20} className="text-primary" />
                                )}
                            </button>
                        )}
                        {navigationItems.auth.map((item: NavigationItem) => (
                            <NavLink
                                key={item.key}
                                to={item.to!}
                                ref={el => {
                                    elementRefs.current[item.to!] = el;
                                }}
                                enableActiveState={true}
                                className="py-4 px-2"
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Framer Motion indicator */}
                    <motion.div
                        layoutId="site-nav-indicator"
                        className="absolute bottom-0 h-0.5 bg-primary"
                        animate={(() => {
                            const element = elementRefs.current[indicatorActiveKey];

                            if (isTransitioning && element) {
                                const container = element.closest('.nav-container');
                                const containerRect = container?.getBoundingClientRect();
                                const elementRect = element.getBoundingClientRect();
                                return {
                                    opacity: 0,
                                    left: containerRect ? elementRect.left - containerRect.left : element.offsetLeft,
                                    width: element.offsetWidth,
                                };
                            }

                            return {
                                opacity: isVisible ? 1 : 0,
                                ...(isVisible && element
                                    ? {
                                          left: (() => {
                                              const container = element.closest('.nav-container');
                                              if (!container) return element.offsetLeft;
                                              const containerRect = container.getBoundingClientRect();
                                              const elementRect = element.getBoundingClientRect();
                                              return elementRect.left - containerRect.left;
                                          })(),
                                          width: element.offsetWidth,
                                      }
                                    : frozenPosition
                                      ? {
                                            left: frozenPosition.left,
                                            width: frozenPosition.width,
                                        }
                                      : {}),
                            };
                        })()}
                        transition={{
                            opacity: { duration: 0.2 },
                            left: { duration: 0.3, ease: 'easeInOut' },
                            width: { duration: 0.3, ease: 'easeInOut' },
                        }}
                    />
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex justify-between items-center h-16">
                    <Link
                        to={props.siteNavType === 'admin' ? '/admin/dashboard' : '/'}
                        className="flex items-center text-primary hover:text-primary/90"
                    >
                        <img src="/logo_dark.svg" alt="clubhive" className="h-8" />
                    </Link>

                    <button
                        onClick={toggleMenu}
                        className="text-on-surface hover:text-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className={`md:hidden border-t ${variant === 'about-page' ? 'border-white/10' : 'border-outline-variant'}`}>
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navigationItems.main.map((item: NavigationItem) => (
                                <NavLink
                                    key={item.key}
                                    to={item.to!}
                                    onClick={closeMenu}
                                    className="hover:bg-primary-container block text-base"
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                        <div className={`pt-4 pb-3 border-t ${variant === 'about-page' ? 'border-white/10' : 'border-outline-variant'}`}>
                            <div className="px-2 space-y-1">
                                {navigationItems.auth.map((item: NavigationItem) => (
                                    <NavLink
                                        key={item.key}
                                        to={item.to!}
                                        onClick={closeMenu}
                                        variant="default"
                                        className="hover:bg-primary-container block text-base"
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

// Tab navigation renderer
function renderTabNavigation({ props, navigationItems, elementRefs, isVisible, indicatorActiveKey, style }: any) {
    const contextKey = props.selectedEvent ? 'event-tabs' : props.showOfficerView ? 'officer-tabs' : 'member-tabs';

    return (
        <div className={`border-b border-outline-variant ${style.className || ''}`}>
            <nav className="flex justify-between relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={contextKey}
                        className="flex space-x-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                            opacity: 0,
                            y: 50,
                            transition: { duration: 0.2, ease: 'easeIn' },
                        }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        {navigationItems.main.map((tab: NavigationItem) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.key}
                                    ref={(el: HTMLButtonElement | null) => {
                                        elementRefs.current[tab.key] = el;
                                    }}
                                    onClick={() => {
                                        props.onTabChange(tab.key as TabType);
                                    }}
                                    className={`flex items-center py-3 px-1 font-medium text-sm transition-colors cursor-pointer relative ${
                                        props.activeTab === tab.key ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                                    }`}
                                >
                                    {Icon && <Icon className="w-4 h-4 mr-2" />}
                                    {tab.label}
                                </button>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                {/* Membership tab (right side) */}
                {!props.selectedEvent && navigationItems.membership.length > 0 && (
                    <div>
                        <AnimatePresence>
                            {navigationItems.membership.map((tab: NavigationItem) => {
                                const Icon = tab.icon;
                                return (
                                    <motion.button
                                        key={tab.key}
                                        ref={(el: HTMLButtonElement | null) => {
                                            elementRefs.current[tab.key] = el;
                                        }}
                                        onClick={() => {
                                            props.onTabChange(tab.key as TabType);
                                        }}
                                        className={`flex items-center py-3 px-1 font-medium text-sm transition-colors cursor-pointer relative ${
                                            props.activeTab === tab.key ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                                        }`}
                                        initial={{ opacity: 0, y: -20, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{
                                            opacity: 0,
                                            y: 50,
                                            scale: 0.8,
                                            transition: { duration: 0.2, ease: 'easeIn' },
                                        }}
                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                    >
                                        {Icon && <Icon className="w-4 h-4 mr-2" />}
                                        {tab.label}
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {/* Framer Motion indicator */}
                <motion.div
                    layoutId="tab-nav-indicator"
                    className="absolute bottom-0 h-0.5 bg-primary"
                    animate={{
                        opacity: isVisible ? 1 : 0,
                        ...(isVisible && {
                            left: (() => {
                                const element = elementRefs.current[indicatorActiveKey];
                                if (!element) return 0;
                                const container = element.closest('nav');
                                if (!container) return element.offsetLeft;
                                const containerRect = container.getBoundingClientRect();
                                const elementRect = element.getBoundingClientRect();
                                return elementRect.left - containerRect.left;
                            })(),
                            width: elementRefs.current[indicatorActiveKey]?.offsetWidth || 0,
                        }),
                    }}
                    transition={{
                        opacity: { duration: 0.2 },
                        left: { duration: 0.3, ease: 'easeInOut' },
                        width: { duration: 0.3, ease: 'easeInOut' },
                    }}
                />
            </nav>
        </div>
    );
}
