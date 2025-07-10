import { LogOut, Crown, Trash2 } from 'lucide-react';
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
                    My Membership
                </h3>

                <div className="mb-8">
                    <h4 className="font-medium text-on-surface mb-4">
                        Overview
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-primary-container rounded-lg p-4">
                            <div className="text-2xl font-bold text-primary mb-1">
                                {club.role === 'owner'
                                    ? 'Owner'
                                    : club.role === 'officer'
                                      ? 'Officer'
                                      : 'Member'}
                            </div>
                            <div className="text-xs text-on-surface-variant uppercase tracking-wide">
                                Role
                            </div>
                        </div>
                        <div className="bg-surface-variant/50 rounded-lg p-4">
                            <div className="text-2xl font-bold text-on-surface mb-1">
                                {membershipData.joinDate}
                            </div>
                            <div className="text-xs text-on-surface-variant uppercase tracking-wide">
                                Joined
                            </div>
                        </div>
                        <div className="bg-surface-variant/50 rounded-lg p-4">
                            <div className="text-2xl font-bold text-on-surface mb-1">
                                {membershipData.eventsAttended}
                            </div>
                            <div className="text-xs text-on-surface-variant uppercase tracking-wide">
                                Events Attended
                            </div>
                        </div>
                        <div className="bg-surface-variant/50 rounded-lg p-4">
                            <div className="text-2xl font-bold text-on-surface mb-1">
                                {membershipData.eventsAttended &&
                                membershipData.totalEvents
                                    ? Math.round(
                                          (membershipData.eventsAttended /
                                              membershipData.totalEvents) *
                                              100
                                      )
                                    : 0}
                                %
                            </div>
                            <div className="text-xs text-on-surface-variant uppercase tracking-wide">
                                Attendance Rate
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 max-w-2xl">
                    <div className="border-t border-outline-variant pt-6">
                        <h4 className="font-medium text-on-surface mb-2">
                            Membership Actions
                        </h4>
                        <p className="text-on-surface-variant text-sm mb-4">
                            Manage your membership in this club.
                        </p>
                        {!isOwner ? (
                            <button className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer">
                                <LogOut className="w-4 h-4 mr-2" />
                                Leave Club
                            </button>
                        ) : (
                            <p className="text-on-surface-variant text-sm">
                                As the owner, you cannot leave the club.
                                Transfer ownership or disband the club instead.
                            </p>
                        )}
                    </div>

                    {isOwner && (
                        <>
                            <div className="border-t border-outline-variant pt-6">
                                <h4 className="font-medium text-on-surface mb-2">
                                    Ownership
                                </h4>
                                <p className="text-on-surface-variant text-sm mb-4">
                                    Transfer ownership of this club to another
                                    member.
                                </p>
                                <button className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-yellow-500 text-black hover:bg-yellow-600 transition-colors cursor-pointer">
                                    <Crown className="w-4 h-4 mr-2" />
                                    Transfer Ownership
                                </button>
                            </div>

                            <div className="border-t border-outline-variant pt-6">
                                <h4 className="font-medium text-on-surface mb-2">
                                    Danger Zone
                                </h4>
                                <p className="text-on-surface-variant text-sm mb-4">
                                    Permanently delete this club and all its
                                    data. This action cannot be undone.
                                </p>
                                <button className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Disband Club
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
