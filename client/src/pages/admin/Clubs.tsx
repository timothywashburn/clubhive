import { useState, useMemo } from 'react';
import { AdminTable, AdminTableColumn, AdminTableItem, AdminToolbar } from '../../components/admin';
import { useClubData } from '../../hooks/fetchClubs';

const columns: AdminTableColumn[] = [
    {
        key: 'name',
        label: 'Club Name',
        width: '25%',
    },
    {
        key: 'school',
        label: 'School',
        width: '25%',
    },
    {
        key: 'memberCount',
        label: 'Members',
        width: '15%',
        render: value => `${value}`,
    },
    {
        key: 'eventsCount',
        label: 'Events',
        width: '15%',
        render: value => `${value}`,
    },
    {
        key: 'createdAt',
        label: 'Date Created',
        width: '20%',
        render: value => new Date(value).toLocaleDateString(),
    },
];

export function AdminClubs() {
    const { clubs, isLoading, error, refetch, isRefreshing } = useClubData();
    const [searchValue, setSearchValue] = useState('');

    const clubItems: AdminTableItem[] = useMemo(() => {
        return clubs.map(club => ({
            id: club._id,
            name: club.name,
            school: typeof club.school === 'object' ? club.school.name : club.school,
            memberCount: club.memberCount,
            eventsCount: club.eventCount,
            createdAt: club.createdAt,
            schoolLocation: typeof club.school === 'object' ? club.school.location : '',
            tagline: club.tagline,
            description: club.description,
        }));
    }, [clubs]);

    const filteredClubs = useMemo(() => {
        if (searchValue.trim() === '') {
            return clubItems;
        }
        return clubItems.filter(
            club =>
                club.name.toLowerCase().includes(searchValue.toLowerCase()) || club.school.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [clubItems, searchValue]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-on-surface mb-6">Clubs Management</h1>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-on-surface-variant">Loading clubs...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-on-surface mb-6">Clubs Management</h1>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-error">Error loading clubs: {error}</div>
                    </div>
                </div>
            </div>
        );
    }

    const renderExpandedContent = (club: AdminTableItem) => (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <h4 className="font-medium text-on-surface mb-2">Club Details</h4>
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="text-on-surface-variant">School:</span>{' '}
                            <span className="text-on-surface">
                                {club.school} ({club.schoolLocation})
                            </span>
                        </p>
                        <p>
                            <span className="text-on-surface-variant">Tagline:</span>{' '}
                            <span className="text-on-surface">{club.tagline}</span>
                        </p>
                        <p>
                            <span className="text-on-surface-variant">Description:</span>{' '}
                            <span className="text-on-surface">{club.description}</span>
                        </p>
                        <p>
                            <span className="text-on-surface-variant">Created:</span>{' '}
                            <span className="text-on-surface">{new Date(club.createdAt).toLocaleDateString()}</span>
                        </p>
                    </div>
                </div>
                <div>
                    <h4 className="font-medium text-on-surface mb-2">Statistics</h4>
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="text-on-surface-variant">Active Members:</span>{' '}
                            <span className="text-on-surface">{club.memberCount}</span>
                        </p>
                        <p>
                            <span className="text-on-surface-variant">Total Events:</span>{' '}
                            <span className="text-on-surface">{club.eventsCount}</span>
                        </p>
                        <p>
                            <span className="text-on-surface-variant">Club ID:</span> <span className="text-on-surface">{club.id}</span>
                        </p>
                    </div>
                </div>
                <div>
                    <h4 className="font-medium text-on-surface mb-2">Actions</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button className="px-3 py-2 text-sm font-medium border border-outline-variant text-on-surface rounded-md hover:bg-surface-variant transition-colors text-center cursor-pointer">
                            Edit Details
                        </button>
                        <button className="px-3 py-2 text-sm font-medium bg-primary text-on-primary rounded-md hover:bg-primary/90 transition-colors text-center cursor-pointer">
                            View Members
                        </button>
                        <button className="px-3 py-2 text-sm font-medium bg-secondary text-on-secondary rounded-md hover:bg-secondary/90 transition-colors text-center cursor-pointer">
                            View Events
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
            additionalActions={
                <button className="px-4 py-2 border border-outline-variant text-on-surface rounded-lg hover:bg-surface-variant transition-colors cursor-pointer">
                    Filter
                </button>
            }
        />
    );

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-on-surface mb-6">Clubs Management</h1>
                <AdminTable
                    title="All Clubs"
                    columns={columns}
                    items={filteredClubs}
                    renderExpandedContent={renderExpandedContent}
                    toolbar={toolbar}
                    emptyMessage="No clubs found"
                />
            </div>
        </div>
    );
}
