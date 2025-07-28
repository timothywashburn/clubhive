import { Users, Clock, MapPin } from 'lucide-react';
import { UserClubData } from '@clubhive/shared';

interface MemberInfoProps {
    club: UserClubData;
}

export function MemberInfo({ club }: MemberInfoProps) {
    return (
        <div className="space-y-6">
            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <h3 className="text-lg font-medium text-on-surface mb-4">Club Information</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-on-surface">Description</h4>
                        <p className="text-on-surface-variant">{club.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-on-surface">Meeting Time</h4>
                            <p className="text-on-surface-variant flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Not specified
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-on-surface">Location</h4>
                            <p className="text-on-surface-variant flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {club.school.location}
                            </p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-on-surface">Members</h4>
                        <p className="text-on-surface-variant flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            Member count not available
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
