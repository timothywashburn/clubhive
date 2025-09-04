import { Crown, Shield, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { RegisterClubButton } from './RegisterClubButton.tsx';
import { useNavigate } from 'react-router';
import { UserClubData } from '@clubhive/shared';
import { useMyClubsData } from '../../../hooks/useMyClubsData.ts';
import { ClubLogo } from '../../../components/ClubLogo.tsx';

interface ClubSelectorProps {
    clubs: UserClubData[];
    selectedClub: UserClubData | null;
    onClubSelect: (club: UserClubData) => void;
    isMinimized: boolean;
    isAnimating: boolean;
    onToggleMinimize: () => void;
    disabled?: boolean;
}

export function ClubSelector({
    clubs,
    selectedClub,
    onClubSelect,
    isMinimized,
    isAnimating,
    onToggleMinimize,
    disabled = false,
}: ClubSelectorProps) {
    const showText = !isMinimized && !isAnimating;
    const { getClubColors } = useMyClubsData();
    const navigate = useNavigate();

    return (
        <div className="bg-surface rounded-lg shadow border border-outline-variant h-fit">
            <div
                className={`p-4 border-b border-outline-variant flex items-center transition-all duration-300 ${
                    isMinimized ? 'justify-center' : 'justify-between'
                }`}
            >
                <h2
                    className={`text-lg font-semibold text-on-surface transition-all duration-150 ${
                        showText ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden whitespace-nowrap'
                    }`}
                >
                    My Clubs
                </h2>
                <button
                    onClick={onToggleMinimize}
                    className="p-1 cursor-pointer rounded hover:bg-surface-variant transition-colors flex-shrink-0 text-on-surface"
                    title={isMinimized ? 'Expand clubs' : 'Minimize clubs'}
                >
                    {isMinimized ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
                </button>
            </div>
            <div className="p-2">
                {clubs.length === 0 && (
                    <button
                        onClick={() => navigate('/clubs')}
                        className={`w-full p-3 rounded-lg text-left transition-all duration-300 mb-1 group cursor-pointer hover:bg-surface-variant border-dashed border-2 border-outline-variant ${
                            isMinimized ? 'justify-center' : ''
                        }`}
                        title={isMinimized ? 'Find clubs to join' : ''}
                    >
                        <div className={`flex items-center transition-all duration-300 ${isMinimized ? 'justify-center' : 'space-x-3'}`}>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-primary/10 text-primary border-2 border-dashed border-primary/30">
                                <Search className="w-5 h-5" />
                            </div>
                            <div
                                className={`flex-1 min-w-0 transition-all duration-150 ${
                                    showText ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                                }`}
                            >
                                <h3 className="font-medium text-on-surface truncate pr-2">Find clubs to join</h3>
                                <p className="text-xs text-on-surface-variant truncate italic">Discover communities near you</p>
                            </div>
                        </div>
                    </button>
                )}
                {clubs.map(club => {
                    const clubInitials = club.name
                        .split(' ')
                        .map(word => word[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                    return (
                        <button
                            key={club._id}
                            onClick={() => !disabled && onClubSelect(club)}
                            className={`w-full px-2.5 py-3 rounded-lg text-left transition-all duration-300 mb-1 group ${
                                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                            } ${disabled && selectedClub?._id !== club._id ? 'opacity-50' : ''} ${
                                selectedClub?._id === club._id
                                    ? 'bg-primary-container border-l-4 border-primary'
                                    : disabled
                                      ? ''
                                      : 'hover:bg-surface-variant hover:border-l-4 border-primary/50'
                            }`}
                            title={isMinimized ? club.name : ''}
                            disabled={disabled}
                        >
                            <div className={`flex items-center transition-all duration-300 ${isMinimized ? 'justify-center' : ''}`}>
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold relative flex-shrink-0 transition-all duration-300 overflow-hidden ${isMinimized ? '' : 'mr-3'}`}
                                >
                                    <ClubLogo
                                        clubLogo={club.clubLogo}
                                        clubName={club.name}
                                        size="md"
                                        className="w-10 h-10" // Override size to match your design
                                    />
                                    {isMinimized && club.userRole === 'owner' && (
                                        <Crown size={16} className="text-warning absolute -top-1.5 -right-1.5" />
                                    )}
                                    {isMinimized && club.userRole === 'officer' && (
                                        <Shield size={16} className="text-primary absolute -top-1.5 -right-1.5" />
                                    )}
                                </div>
                                <div
                                    className={`flex-1 min-w-0 transition-all duration-150 ${
                                        showText ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                                    }`}
                                >
                                    <h3 className="font-medium text-on-surface truncate pr-2">{club.name}</h3>
                                    <p className="text-xs text-on-surface-variant truncate italic">{club.tagline}</p>
                                </div>
                                <div
                                    className={`flex items-center transition-all duration-150 ${
                                        showText ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                                    }`}
                                >
                                    {club.userRole === 'owner' && (
                                        <Crown size={24} strokeWidth={2.5} className="text-warning flex-shrink-0" />
                                    )}
                                    {club.userRole === 'officer' && (
                                        <Shield size={24} strokeWidth={2.5} className="text-primary flex-shrink-0" />
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
                <RegisterClubButton isMinimized={isMinimized} isAnimating={isAnimating} />
            </div>
        </div>
    );
}
