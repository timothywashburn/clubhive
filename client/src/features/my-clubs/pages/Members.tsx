import React from 'react';

export function Members({ club }: { club: any }) {
    if (!club?.members || club.members.length === 0) {
        return <p className="text-on-surface-variant">No members yet.</p>;
    }

    return (
        <div className="space-y-4">
            {club.members.map((member: any) => (
                <div key={member._id} className="p-4 bg-surface-variant rounded-lg border border-outline-variant">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-on-surface-variant">{member.email}</p>
                </div>
            ))}
        </div>
    );
}
