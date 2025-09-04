import { useState, useMemo } from 'react';
import { AdminTable, AdminTableColumn, AdminTableItem, AdminToolbar } from '../components';
import { useUserData } from '../../../hooks/useUserData.ts';

const columns: AdminTableColumn[] = [
    {
        key: 'name',
        label: 'Name',
        width: '25%',
    },
    {
        key: 'major',
        label: 'Major',
        width: '35%',
    },
    {
        key: 'school',
        label: 'School',
        width: '25%',
    },
    {
        key: 'clubsCount',
        label: 'Clubs',
        width: '15%',
        render: value => `${value}`,
    },
];

export function AdminUsers() {
    const { users, isLoading, error, refetch, isRefreshing } = useUserData();
    const [searchValue, setSearchValue] = useState('');

    const userItems: AdminTableItem[] = useMemo(() => {
        return users.map(user => ({
            id: user._id,
            name: user.name,
            major: user.major,
            school: typeof user.school === 'object' ? user.school.name : user.school,
            year: user.year,
            educationType: user.educationType,
            clubsCount: user.clubsCount,
            schoolLocation: typeof user.school === 'object' ? user.school.location : '',
        }));
    }, [users]);

    const filteredUsers = useMemo(() => {
        if (searchValue.trim() === '') {
            return userItems;
        }
        return userItems.filter(
            user =>
                user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                user.major.toLowerCase().includes(searchValue.toLowerCase()) ||
                user.school.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [userItems, searchValue]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-on-surface mb-6">Users Management</h1>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-on-surface-variant">Loading users...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-on-surface mb-6">Users Management</h1>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-error">Error loading users: {error}</div>
                    </div>
                </div>
            </div>
        );
    }

    const renderExpandedContent = (user: AdminTableItem) => (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <h4 className="font-medium text-on-surface mb-2">User Details</h4>
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="text-on-surface-variant">School:</span>{' '}
                            <span className="text-on-surface">
                                {user.school} ({user.schoolLocation})
                            </span>
                        </p>
                        <p>
                            <span className="text-on-surface-variant">Major:</span> <span className="text-on-surface">{user.major}</span>
                        </p>
                        <p>
                            <span className="text-on-surface-variant">Education:</span>{' '}
                            <span className="text-on-surface">{user.educationType}</span>
                        </p>
                        <p>
                            <span className="text-on-surface-variant">Year:</span> <span className="text-on-surface">{user.year}</span>
                        </p>
                    </div>
                </div>
                <div>
                    <h4 className="font-medium text-on-surface mb-2">Activity</h4>
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="text-on-surface-variant">User ID:</span> <span className="text-on-surface">{user.id}</span>
                        </p>
                        <p>
                            <span className="text-on-surface-variant">Total Clubs:</span>{' '}
                            <span className="text-on-surface">{user.clubsCount}</span>
                        </p>
                        <p>
                            <span className="text-on-surface-variant">Events Attended:</span> <span className="text-on-surface">N/A</span>
                        </p>
                    </div>
                </div>
                <div>
                    <h4 className="font-medium text-on-surface mb-2">Actions</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button className="px-3 py-2 text-sm font-medium border border-outline-variant text-on-surface rounded-md hover:bg-surface-variant transition-colors text-center cursor-pointer">
                            View Profile
                        </button>
                        <button className="px-3 py-2 text-sm font-medium bg-primary text-on-primary rounded-md hover:bg-primary/90 transition-colors text-center cursor-pointer">
                            View Clubs
                        </button>
                        <button className="px-3 py-2 text-sm font-medium bg-secondary text-on-secondary rounded-md hover:bg-secondary/90 transition-colors text-center cursor-pointer">
                            Send Message
                        </button>
                        <button className="px-3 py-2 text-sm font-medium bg-error text-on-error rounded-md hover:bg-error/90 transition-colors text-center cursor-pointer">
                            Suspend
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const toolbar = (
        <AdminToolbar
            searchValue={searchValue}
            onSearchChange={handleSearch}
            showCreateButton={false}
            onRefresh={refetch}
            isRefreshing={isRefreshing}
            additionalActions={<button className="px-4 py-2 border border-outline-variant text-on-surface cursor-pointer">Filter</button>}
        />
    );

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-on-surface mb-6">Users Management</h1>
                <AdminTable
                    title="All Users"
                    columns={columns}
                    items={filteredUsers}
                    renderExpandedContent={renderExpandedContent}
                    toolbar={toolbar}
                    emptyMessage="No users found"
                />
            </div>
        </div>
    );
}
