import { Users, Clock, MapPin } from 'lucide-react';
import { Club } from '../types';

interface MemberInfoProps {
    club: Club;
}

export function MemberInfo({ club }: MemberInfoProps) {
    return (
        <div className="space-y-6">
            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <h3 className="text-lg font-medium text-on-surface mb-4">
                    Club Information
                </h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-on-surface">
                            Description
                        </h4>
                        <p className="text-on-surface-variant">
                            {club.description}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-on-surface">
                                Meeting Time
                            </h4>
                            <p className="text-on-surface-variant flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {club.meetingTime}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-on-surface">
                                Location
                            </h4>
                            <p className="text-on-surface-variant flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {club.location}
                            </p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-on-surface">Members</h4>
                        <p className="text-on-surface-variant flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {club.memberCount} active members
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
