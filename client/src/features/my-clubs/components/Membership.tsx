import { LogOut, Crown, Trash2, Globe, Instagram, Mail } from 'lucide-react';
import { Club } from '../types';
import { useMyClubsData } from '../hooks';

interface MembershipProps {
    club: Club;
    isOwner: boolean;
}

export function Membership({ club, isOwner }: MembershipProps) {
    const { getMembershipData } = useMyClubsData();
    const membershipData = getMembershipData(club);

    return (
        <div className="space-y-6">
            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <h3 className="text-lg font-medium text-on-surface mb-6">
                    Membership Card
                </h3>

                <div className="mb-8">
                    <div className="flex gap-4">
                        {/* Front of Card */}
                        <div
                            className="relative w-full max-w-sm aspect-[1.586/1] overflow-hidden rounded-xl p-6 border border-outline"
                            style={{
                                background: `linear-gradient(135deg, ${club.brandColor}20, ${club.brandColor}40)`,
                            }}
                        >
                            <div className="absolute top-1/2 left-1/2 w-64 h-64 opacity-8 select-none pointer-events-none transform -translate-x-1/2 -translate-y-1/2">
                                <img
                                    src={club.logoImage}
                                    alt="Club logo background"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                                <div className="mb-4">
                                    <h2 className="text-3xl font-bold text-on-surface leading-tight">
                                        {club.name}
                                    </h2>
                                </div>
                                {(club.role === 'owner' ||
                                    club.role === 'officer') && (
                                    <>
                                        <div className="w-16 h-px bg-on-surface-variant/30 mb-3"></div>
                                        <div
                                            className="text-lg font-semibold"
                                            style={{ color: club.brandColor }}
                                        >
                                            {club.role === 'owner'
                                                ? 'Owner'
                                                : 'Officer'}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Back of Card */}
                        <div className="relative w-full max-w-sm aspect-[1.586/1] overflow-hidden rounded-xl border border-outline bg-surface">
                            {/* Magnetic Strip */}
                            <div className="absolute top-4 left-0 right-0 h-8 bg-gradient-to-r from-black to-gray-900"></div>

                            <div className="p-6 pt-16 h-full flex flex-col">
                                <div className="mb-4">
                                    <h4 className="font-bold text-on-surface mb-1">
                                        John Doe
                                    </h4>
                                    <p className="text-sm text-on-surface-variant">
                                        Valid since {membershipData.joinDate}
                                    </p>
                                </div>

                                <div className="flex flex-col justify-between flex-1">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                                            <Globe className="w-3 h-3" />
                                            <span>vgdc.dev</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                                            <Instagram className="w-3 h-3" />
                                            <span>vgdc.at.ucsd</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                                            <Mail className="w-3 h-3" />
                                            <span>vgdc@ucsd.edu</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden"
                                            style={{
                                                backgroundColor: `${club.brandColor}15`,
                                            }}
                                        >
                                            <img
                                                src={club.logoImage}
                                                alt={`${club.name} logo`}
                                                className="w-8 h-8 object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 max-w-2xl">
                    <div className="border-t border-outline-variant pt-6">
                        <div className="rounded-lg p-6 bg-error-container">
                            <h4 className="font-medium text-on-error-container mb-2 flex items-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                Danger Zone
                            </h4>
                            <p className="text-on-error-container text-sm mb-6">
                                These actions are irreversible and will
                                permanently affect your membership.
                            </p>

                            <div className="space-y-4">
                                {!isOwner && (
                                    <div className="flex items-center justify-between p-4 border border-error-container rounded-lg bg-surface">
                                        <div>
                                            <h5 className="font-medium text-error mb-1">
                                                Leave Club
                                            </h5>
                                            <p className="text-on-error-container text-sm">
                                                Remove yourself from this club
                                                and lose access to all content.
                                            </p>
                                        </div>
                                        <button className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-error text-on-error hover:bg-error/90 transition-colors cursor-pointer">
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Leave
                                        </button>
                                    </div>
                                )}

                                {isOwner && (
                                    <>
                                        <div className="flex items-center justify-between p-4 border border-error-container rounded-lg bg-surface">
                                            <div>
                                                <h5 className="font-medium text-on-error-container mb-1">
                                                    Transfer Ownership
                                                </h5>
                                                <p className="text-on-error-container text-sm">
                                                    Transfer ownership of this
                                                    club to another member.
                                                </p>
                                            </div>
                                            <button className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-error text-on-error hover:bg-error/90 transition-colors cursor-pointer">
                                                <Crown className="w-4 h-4 mr-2" />
                                                Transfer
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 border border-error-container rounded-lg bg-surface">
                                            <div>
                                                <h5 className="font-medium text-on-error-container mb-1">
                                                    Disband Club
                                                </h5>
                                                <p className="text-on-error-container text-sm">
                                                    Permanently delete this club
                                                    and all its data. This
                                                    cannot be undone.
                                                </p>
                                            </div>
                                            <button className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-error text-on-error hover:bg-error/90 transition-colors cursor-pointer">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Disband
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
