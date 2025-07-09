import { Link } from 'react-router';

interface NavLinkProps {
    to: string;
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'default' | 'button';
    className?: string;
}

export function NavLink({
    to,
    children,
    onClick,
    variant = 'default',
    className,
}: NavLinkProps) {
    const baseClasses =
        variant === 'button'
            ? 'bg-primary text-on-primary hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors'
            : 'text-on-surface hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors';

    const mobileClasses = className?.includes('block')
        ? `${baseClasses} ${className}`
        : baseClasses;

    return (
        <Link to={to} className={mobileClasses} onClick={onClick}>
            {children}
        </Link>
    );
}
