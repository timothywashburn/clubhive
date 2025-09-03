import { LogOut, Crown, Trash2, Globe, Instagram, Mail } from 'lucide-react';
import { UserClubData } from '@clubhive/shared';
import { DangerZone } from '../../../components/DangerZone';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMyClubsData } from '../../../hooks/useMyClubsData.ts';
import { useToast } from '../../../hooks/useToast';
import { useImageData } from '../../../hooks/useImageData.ts';
import { ClubLogo } from '../../../components/ClubLogo.tsx';

interface MembershipProps {
    club: UserClubData;
    isOwner: boolean;
}

export function Membership({ club, isOwner }: MembershipProps) {
    const navigate = useNavigate();
    const { getMembershipData } = useMyClubsData();
    const membershipData = getMembershipData(club);
    const { successToast, errorToast } = useToast();

    const [leaveLoading, setLeaveLoading] = useState(false);
    const [transferLoading, setTransferLoading] = useState(false);
    const [disbandLoading, setDisbandLoading] = useState(false);

    const { image: clubLogoImage } = useImageData(club.clubLogo);

    const handleLeaveClub = async () => {
        setLeaveLoading(true);
        try {
            console.log('Leaving club:', club.name);

            const response = await fetch(`/api/memberships/${club._id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                successToast('Successfully left the club');
                navigate('/my-clubs');
            } else {
                throw new Error(data.error?.message || 'Failed to leave club');
            }
        } catch (error) {
            console.error('Error leaving club:', error);
            errorToast('Failed to leave club');
        } finally {
            setLeaveLoading(false);
        }
    };

    const handleTransferOwnership = async () => {
        setTransferLoading(true);
        try {
            // TODO: Implement transfer ownership flow (maybe open a modal to select member)
            console.log('Transferring ownership of:', club.name);
            await new Promise(resolve => setTimeout(resolve, 2000));
            successToast('Ownership transfer initiated');
        } catch (error) {
            console.error('Error transferring ownership:', error);
            errorToast('Failed to transfer ownership');
        } finally {
            setTransferLoading(false);
        }
    };

    const handleDisbandClub = async () => {
        setDisbandLoading(true);
        try {
            console.log('Disbanding club:', club.name);

            const response = await fetch(`/api/clubs/${club._id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                successToast('Club successfully disbanded');
                navigate('/my-clubs');
            } else {
                throw new Error(data.error?.message || 'Failed to disband club');
            }
        } catch (error) {
            console.error('Error disbanding club:', error);
            errorToast('Failed to disband club');
        } finally {
            setDisbandLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <h3 className="text-lg font-medium text-on-surface mb-6">Membership Card</h3>

                <div className="mb-8">
                    <div className="flex gap-4">
                        {/* Front of Card */}
                        <div
                            className="relative w-full max-w-sm aspect-[1.586/1] overflow-hidden rounded-xl p-6 border border-outline"
                            style={{
                                background: `linear-gradient(135deg, #3b82f620, #3b82f640)`,
                            }}
                        >
                            <div className="absolute top-1/2 left-1/2 w-64 h-64 opacity-8 select-none pointer-events-none transform -translate-x-1/2 -translate-y-1/2">
                                <img
                                    src={clubLogoImage?.url || '/vgdc-square-logo.png'}
                                    alt="Club logo background"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="h-full flex flex-col justify-center items-center text-center">
                                <div className="mb-4">
                                    <h2 className="text-3xl font-bold text-on-surface leading-tight">{club.name}</h2>
                                </div>
                                {(club.userRole === 'owner' || club.userRole === 'officer') && (
                                    <>
                                        <div className="w-16 h-px bg-on-surface-variant/30 mb-3"></div>
                                        <div className="text-lg font-semibold" style={{ color: '#3b82f6' }}>
                                            {club.userRole === 'owner' ? 'Owner' : 'Officer'}
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
                                    <h4 className="font-bold text-on-surface mb-1">John Doe</h4>
                                    <p className="text-sm text-on-surface-variant">Valid since {membershipData.joinDate}</p>
                                </div>

                                <div className="flex flex-col justify-between flex-1">
                                    <div className="space-y-2">
                                        {club.socials?.website && (
                                            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                                                <Globe className="w-3 h-3" />
                                                <span>{club.socials.website}</span>
                                            </div>
                                        )}
                                        {club.socials?.instagram && (
                                            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                                                <Instagram className="w-3 h-3" />
                                                <span>{club.socials.instagram}</span>
                                            </div>
                                        )}
                                        {club.url && (
                                            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                                                <Mail className="w-3 h-3" />
                                                <span>{club.url}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden"
                                            style={{
                                                backgroundColor: `#3b82f615`,
                                            }}
                                        >
                                            <ClubLogo clubLogo={club.clubLogo} clubName={club.name} size="md" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 max-w-2xl">
                    <div className="border-t border-outline-variant pt-6">
                        <DangerZone
                            title="Danger Zone"
                            description="These actions are irreversible and will permanently affect your membership."
                            actions={[
                                // Non-owner actions
                                ...(!isOwner
                                    ? [
                                          {
                                              label: 'Leave Club',
                                              description: 'Remove yourself from this club and lose access to all content.',
                                              onClick: handleLeaveClub,
                                              isLoading: leaveLoading,
                                              loadingText: 'Leaving...',
                                              icon: LogOut,
                                          },
                                      ]
                                    : []),
                                // Owner actions
                                ...(isOwner
                                    ? [
                                          // TODO: this could probably be implemented in the members page (where other promotions will be)
                                          // {
                                          //     label: 'Transfer Ownership',
                                          //     description: 'Transfer ownership of this club to another member.',
                                          //     onClick: handleTransferOwnership,
                                          //     isLoading: transferLoading,
                                          //     loadingText: 'Processing...',
                                          //     icon: Crown,
                                          // },
                                          {
                                              label: 'Disband Club',
                                              description: 'Permanently delete this club and all its data. This cannot be undone.',
                                              onClick: handleDisbandClub,
                                              isLoading: disbandLoading,
                                              loadingText: 'Disbanding...',
                                              icon: Trash2,
                                          },
                                      ]
                                    : []),
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
