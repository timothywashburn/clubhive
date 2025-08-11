import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, User, UserX } from 'lucide-react';
import { NavLink } from './NavLink.tsx';
import { useNavIndicator } from './useNavIndicator.ts';

interface NavbarProps {
    isAuthenticated: boolean;
    toggleAuth: () => void;
}

export function Navbar({ isAuthenticated, toggleAuth }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const isAboutPage = location.pathname === '/about';

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => setIsMenuOpen(false);

    const mainNavItems = [
        { to: '/my-clubs', label: 'My Clubs' },
        { to: '/clubs', label: 'Find Clubs' },
        { to: '/events', label: 'Events' },
    ];

    const authNavItems = isAuthenticated
        ? [
              { to: '/notifications', label: 'Notifications' },
              { to: '/account', label: 'Account' },
          ]
        : [
              { to: '/signin', label: 'Sign In' },
              { to: '/signup', label: 'Create Account' },
          ];

    const allNavPaths = useMemo(() => [...mainNavItems.map(item => item.to), ...authNavItems.map(item => item.to)], [isAuthenticated]);
    const { indicatorStyle, shouldAnimate, setShouldAnimate, navRefs, isVisible } = useNavIndicator(location.pathname, allNavPaths);

    return (
        <nav
            style={{ zIndex: 1 }}
            className={`${isAboutPage ? 'bg-black/20 backdrop-blur-md border-b border-white/10' : 'bg-surface shadow-md border-b border-outline-variant'} flex-shrink-0`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="hidden md:flex justify-between items-center h-16 nav-container relative">
                    {/* Left Aligned Content */}
                    <div className="flex items-center space-x-12">
                        <Link to="/" className="text-xl font-bold text-primary hover:text-primary/90">
                            clubhive
                        </Link>

                        <div className="flex space-x-6">
                            {mainNavItems.map(item => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    ref={el => {
                                        navRefs.current[item.to] = el;
                                    }}
                                    enableActiveState={true}
                                    setShouldAnimate={setShouldAnimate}
                                    className="py-4 px-2"
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Right aligned content */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleAuth}
                            className="p-2 rounded-md bg-secondary-container hover:bg-primary-container transition-colors cursor-pointer"
                            title={isAuthenticated ? 'Log out' : 'Log in'}
                        >
                            {isAuthenticated ? <User size={20} className="text-primary" /> : <UserX size={20} className="text-primary" />}
                        </button>
                        {authNavItems.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                ref={el => {
                                    navRefs.current[item.to] = el;
                                }}
                                enableActiveState={true}
                                setShouldAnimate={setShouldAnimate}
                                className="py-4 px-2"
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Animated underline indicator */}
                    <div
                        className={`absolute bottom-0 h-0.5 bg-primary ${shouldAnimate ? 'transition-all duration-300 ease-in-out' : ''}`}
                        style={{
                            left: `${indicatorStyle.left}px`,
                            width: `${indicatorStyle.width}px`,
                            opacity: isVisible ? 1 : 0,
                            transition: shouldAnimate
                                ? 'left 300ms ease-in-out, width 300ms ease-in-out, opacity 500ms ease-in-out'
                                : 'opacity 500ms ease-in-out',
                        }}
                    />
                </div>

                {/* Mobile navigation */}
                <div className="md:hidden flex justify-between items-center h-16">
                    <Link to="/" className="text-xl font-bold text-primary hover:text-primary/90">
                        clubhive
                    </Link>

                    <button
                        onClick={toggleMenu}
                        className="text-on-surface hover:text-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className={`md:hidden border-t ${isAboutPage ? 'border-white/10' : 'border-outline-variant'}`}>
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {mainNavItems.map(item => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    onClick={closeMenu}
                                    className="hover:bg-primary-container block text-base"
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                        <div className={`pt-4 pb-3 border-t ${isAboutPage ? 'border-white/10' : 'border-outline-variant'}`}>
                            <div className="px-2 space-y-1">
                                {authNavItems.map(item => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
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
