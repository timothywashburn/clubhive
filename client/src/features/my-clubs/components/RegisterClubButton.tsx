import { Plus } from 'lucide-react';
import { Link } from 'react-router';

interface RegisterClubButtonProps {
    isMinimized: boolean;
    isAnimating: boolean;
}

export function RegisterClubButton({ isMinimized, isAnimating }: RegisterClubButtonProps) {
    const showText = !isMinimized && !isAnimating;

    return (
        <div className="mt-4">
            <Link to="/register">
                <button
                    type="button"
                    className={`w-full px-4 h-10 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-hover cursor-pointer transition flex items-center ${
                        isMinimized ? 'justify-center' : ''
                    }`}
                >
                    <Plus size={20} className="flex-shrink-0" />
                    <span
                        className={`transition-all duration-150 ${showText ? 'opacity-100 w-auto ml-2' : 'opacity-0 w-0 overflow-hidden'}`}
                    >
                        Register New Club
                    </span>
                </button>
            </Link>
        </div>
    );
}
