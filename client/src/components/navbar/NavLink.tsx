import { Link, useLocation } from 'react-router';
import { forwardRef } from 'react';

interface NavLinkProps {
    to: string;
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'default' | 'button';
    className?: string;
    enableActiveState?: boolean;
    setShouldAnimate?: (animate: boolean) => void;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
    { to, children, onClick, variant = 'default', className, enableActiveState = false, setShouldAnimate },
    ref
) {
    const location = useLocation();
    const isActive = enableActiveState && location.pathname === to;

    const handleClick = () => {
        if (setShouldAnimate) {
            setShouldAnimate(true);
        }
        if (onClick) {
            onClick();
        }
    };

    const baseClasses =
        variant === 'button'
            ? 'bg-primary text-on-primary hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors'
            : enableActiveState
              ? `font-medium text-sm transition-colors cursor-pointer relative ${
                    isActive ? 'text-primary' : 'text-on-surface hover:text-primary'
                }`
              : 'text-on-surface hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors';

    const mobileClasses = className?.includes('block') ? `${baseClasses} ${className}` : baseClasses;

    return (
        <Link ref={ref} to={to} className={mobileClasses} onClick={handleClick}>
            {children}
        </Link>
    );
});
