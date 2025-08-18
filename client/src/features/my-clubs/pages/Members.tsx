import React, { useState, useEffect } from 'react';

export function useClubMembers(clubId: string | null) {
    //hook
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!clubId) return;
        setLoading(true);
        fetch(`/api/clubs/${clubId}/members`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                console.log('Raw response:', data);
                if (data.success) {
                    const formattedMembers = data.members.map((m: any) => ({
                        ...m.user, // _id, name, year, major
                        role: m.role,
                        joinedAt: m.joinedAt,
                    }));
                    setMembers(formattedMembers);
                    console.log('Fetched data:', formattedMembers);
                    // setMembers(data.members);
                    // console.log('Fetched data:', data.members);
                } else setError('Failed to fetch members');
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [clubId]);

    return { members, loading, error, setMembers };
}

export function Members({ club }: { club: any }) {
    const { members, loading, error, setMembers } = useClubMembers(club._id);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingRole, setEditingRole] = useState<string | null>(null);
    const [tempRole, setTempRole] = useState('');
    const [updatingRole, setUpdatingRole] = useState<string | null>(null);

    if (loading) return <p> Loading members...</p>;
    if (error) return <p>Error: {error}</p>;
    //club.members || [];

    const filteredMembers = members.filter(member => member.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    const categorizeMembers = (members: any[]) => {
        const officers = members.filter(member => ['officer'].includes(member.role?.toLowerCase()));
        const execs = members.filter(member => ['owner', 'principal member'].includes(member.role?.toLowerCase()));
        const regularMembers = members.filter(
            member => !officers.some(officer => officer._id === member._id) && !execs.some(exec => exec._id === member._id)
        );

        return { officers, execs, regularMembers };
    };

    const { officers, execs, regularMembers } = categorizeMembers(members);

    const renderMemberColumn = (title: string, membersList: any[], bgColor: string) => (
        <div className="flex-1">
            <div className={`${bgColor} rounded-lg shadow p-6 border border-outline-variant h-full`}>
                <h4 className="text-xl font-bold text-primary mb-4 text-center">{title}</h4>
                {membersList.length === 0 ? (
                    <p className="text-on-surface-variant text-center text-sm">No {title.toLowerCase()} yet.</p>
                ) : (
                    <div className="space-y-3">
                        {membersList.map((member: any) => (
                            <div key={member._id} className="p-3 bg-surface rounded-lg border border-outline-variant">
                                <div className="flex justify-between">
                                    {/* Left side: Name and Role */}
                                    <div className="flex-1">
                                        <p className="font-medium text-base text-on-surface">{member.name}</p>
                                        <p className="text-xs font-semibold text-primary">{member.role}</p>

                                        {editingRole === member._id ? (
                                            <div className="flex items-center gap-2 mt-1">
                                                <input
                                                    type="text"
                                                    value={tempRole}
                                                    onChange={e => setTempRole(e.target.value)}
                                                    className="text-xs px-2 py-1 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleRoleSave(member._id)}
                                                    disabled={updatingRole === member._id}
                                                    className="text-xs px-2 py-1 bg-primary text-on-primary rounded hover:bg-primary-dark disabled:opacity-50"
                                                >
                                                    {updatingRole === member._id ? '...' : '✓'}
                                                </button>
                                                <button
                                                    onClick={handleRoleCancel}
                                                    disabled={updatingRole === member._id}
                                                    className="text-xs px-2 py-1 bg-error text-on-error rounded hover:bg-error-dark disabled:opacity-50"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleRoleEdit(member._id, member.role)}
                                                className="text-xs font-semibold text-primary hover:text-primary-dark hover:underline cursor-pointer text-left"
                                            >
                                                {member.role} ✏️
                                            </button>
                                        )}
                                    </div>

                                    {/* Right side: Year and Major */}
                                    <div className="text-right">
                                        <p className="text-xs text-on-surface-variant">Year: {member.year}</p>
                                        <p className="text-xs text-on-surface-variant">Major: {member.major}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const handleRoleEdit = (memberId: string, currentRole: string) => {
        setEditingRole(memberId);
        setTempRole(currentRole);
    };

    const handleRoleSave = async (memberId: string) => {
        setUpdatingRole(memberId);
        try {
            const response = await fetch(`/api/clubs/${club._id}/members/${memberId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ role: tempRole }),
            });

            const data = await response.json();

            if (data.success) {
                setMembers(prevMembers => prevMembers.map(member => (member._id === memberId ? { ...member, role: tempRole } : member)));
                setEditingRole(null);
                setTempRole('');
            } else {
                alert('Failed to update role: ' + data.message);
            }
        } catch (err) {
            console.error('Error updating role:', err);
            alert('Failed to update role');
        } finally {
            setUpdatingRole(null);
        }
    };

    const handleRoleCancel = () => {
        setEditingRole(null);
        setTempRole('');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <h3 className="text-3xl font-bold text-primary mb-2">Club Members</h3>
                {/* Search Bar */}
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search members by name..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 border border-outline-variant rounded-lg bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center text-sm text-on-surface-variant">
                    <p>Total Members: {members.length}</p>
                    {searchTerm && (
                        <p>
                            Showing: {filteredMembers.length} result{filteredMembers.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>
            </div>

            {/* Three Column Layout */}
            <div className="flex flex-col lg:flex-row gap-6">
                {renderMemberColumn('Execs', execs, 'bg-surface-variant')}
                {renderMemberColumn('Officers', officers, 'bg-surface-variant')}
                {renderMemberColumn('Members', regularMembers, 'bg-surface-variant')}
            </div>
        </div>
    );
}
