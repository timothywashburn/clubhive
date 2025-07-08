import { useState } from 'react';
import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';
import { NavLink } from './NavLink.tsx';

interface NavbarProps {
    isAuthenticated: boolean;
}

export function Navbar({ isAuthenticated }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              { to: '/profile', label: 'Profile' },
          ]
        : [
              { to: '/signin', label: 'Sign In' },
              {
                  to: '/signup',
                  label: 'Create Account',
                  variant: 'button' as const,
              },
          ];

    return (
        <nav className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left Aligned Content */}
                    <div className="flex items-center space-x-12">
                        <Link
                            to="/"
                            className="text-xl font-bold text-orange-600 hover:text-orange-700"
                        >
                            clubhive
                        </Link>

                        <div className="hidden md:flex space-x-6">
                            {mainNavItems.map(item => (
                                <NavLink key={item.to} to={item.to}>
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Right aligned content */}
                    <div className="hidden md:flex items-center space-x-4">
                        {authNavItems.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                variant={item.variant || 'default'}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-700 hover:text-orange-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {mainNavItems.map(item => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    onClick={closeMenu}
                                    className="hover:bg-gray-50 block text-base"
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                        <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="px-2 space-y-1">
                                {authNavItems.map(item => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        onClick={closeMenu}
                                        variant={item.variant || 'default'}
                                        className="hover:bg-gray-50 block text-base"
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
