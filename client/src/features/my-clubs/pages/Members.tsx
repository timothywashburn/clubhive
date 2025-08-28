import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export function useClubMembers(clubId: string | null) {
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
                        ...m.user,
                        role: m.role,
                        joinedAt: m.joinedAt,
                    }));
                    setMembers(formattedMembers);
                    console.log('Fetched data:', formattedMembers);
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

    const [removingMember, setRemovingMember] = useState<string | null>(null);
    const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

    if (loading) return <p> Loading members...</p>;
    if (error) return <p>Error: {error}</p>;

    const filteredMembers = members.filter(member => member.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const categorizeMembers = (members: any[]) => {
        const officers = members.filter(member => member.role?.toLowerCase() === 'officer');
        const execs = members.filter(member => ['owner', 'principal_member'].includes(member.role?.toLowerCase()));
        const regularMembers = members.filter(member => !['officer', 'owner', 'principal_member'].includes(member.role?.toLowerCase()));
        return { officers, execs, regularMembers };
    };

    const roleOptions = ['member', 'officer', 'owner', 'principal_member'];

    const { officers, execs, regularMembers } = categorizeMembers(filteredMembers);

    const handleRemoveMember = async (memberId: string) => {
        setRemovingMember(memberId);
        try {
            const response = await fetch(`/api/clubs/${club._id}/members/${memberId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setMembers(prevMembers => prevMembers.filter(member => member._id !== memberId));
                setConfirmRemove(null);
                console.log('Member removed successfully!');
            } else {
                alert('Failed to remove member: ' + data.message);
            }
        } catch (err) {
            console.error('Error removing member:', err);
            alert('Failed to remove member');
        } finally {
            setRemovingMember(null);
        }
    };

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
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-medium text-base text-on-surface flex-1">{member.name}</p>

                                    <div className="flex-shrink-0 w-32 flex justify-end">
                                        {confirmRemove === member._id ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-on-surface">Remove?</span>
                                                <button
                                                    onClick={() => handleRemoveMember(member._id)}
                                                    disabled={removingMember === member._id}
                                                    className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    {removingMember === member._id ? '...' : 'Yes'}
                                                </button>
                                                <button
                                                    onClick={() => setConfirmRemove(null)}
                                                    disabled={removingMember === member._id}
                                                    className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setConfirmRemove(member._id)}
                                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                                title="Remove member from club"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-2 h-8 flex items-center">
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-xs font-semibold text-primary">Role: {member.role}</p>

                                        <div className="flex-shrink-0 w-32 flex justify-end">
                                            {editingRole === member._id ? (
                                                <div className="flex items-center gap-1">
                                                    <select
                                                        value={tempRole}
                                                        onChange={e => setTempRole(e.target.value)}
                                                        className="text-xs px-1 py-1 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary w-20"
                                                        autoFocus
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter') handleRoleSave(member._id);
                                                            if (e.key === 'Escape') handleRoleCancel();
                                                        }}
                                                    >
                                                        {roleOptions.map(role => (
                                                            <option key={role} value={role}>
                                                                {role}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={() => handleRoleSave(member._id)}
                                                        disabled={updatingRole === member._id}
                                                        className="text-xs px-1 py-1 bg-primary text-on-primary rounded hover:bg-primary-dark disabled:opacity-50 w-6 h-6"
                                                    >
                                                        {updatingRole === member._id ? '...' : '✓'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRoleCancel()}
                                                        disabled={updatingRole === member._id}
                                                        className="text-xs px-1 py-1 bg-error text-on-error rounded hover:bg-error-dark disabled:opacity-50 w-6 h-6"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleRoleEdit(member._id, member.role)}
                                                    className="text-xs text-gray-500 hover:text-primary hover:underline transition-colors cursor-pointer"
                                                    title="Edit role"
                                                >
                                                    Edit role ✏️
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-xs text-on-surface-variant">
                                    <p>Year: {member.year}</p>
                                    <p>Major: {member.major}</p>
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
                body: JSON.stringify({ userRole: tempRole }),
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
            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <h3 className="text-3xl font-bold text-primary mb-2">Club Members</h3>
                {/* search bar */}
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

            <div className="flex flex-col lg:flex-row gap-6">
                {renderMemberColumn('Execs', execs, 'bg-surface-variant')}
                {renderMemberColumn('Officers', officers, 'bg-surface-variant')}
                {renderMemberColumn('Members', regularMembers, 'bg-surface-variant')}
            </div>
        </div>
    );
}
