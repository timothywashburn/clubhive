import { useState, useMemo } from 'react';
import { AdminTable, AdminTableColumn, AdminTableItem, AdminToolbar } from '../../components/admin';
import { useSchoolData } from '../../hooks/fetchSchools';

const columns: AdminTableColumn[] = [
    {
        key: 'name',
        label: 'School Name',
        width: '50%',
    },
    {
        key: 'clubCount',
        label: 'Clubs',
        width: '25%',
        render: value => `${value} clubs`,
    },
    {
        key: 'studentCount',
        label: 'Students',
        width: '25%',
        render: value => value.toLocaleString(),
    },
];

export function AdminSchools() {
    const { schools, isLoading, error, refetch, isRefreshing } = useSchoolData();
    const [searchValue, setSearchValue] = useState('');

    const schoolItems: AdminTableItem[] = useMemo(() => {
        return schools.map(school => ({
            id: school._id,
            name: school.name,
            clubCount: school.clubCount,
            studentCount: school.studentCount,
            location: school.location,
        }));
    }, [schools]);

    const filteredSchools = useMemo(() => {
        if (searchValue.trim() === '') {
            return schoolItems;
        }
        return schoolItems.filter(
            school =>
                school.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                school.location?.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [schoolItems, searchValue]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-on-surface mb-6">Schools Management</h1>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-on-surface-variant">Loading schools...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-on-surface mb-6">Schools Management</h1>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-error">Error loading schools: {error}</div>
                    </div>
                </div>
            </div>
        );
    }

    const renderExpandedContent = (school: AdminTableItem) => (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <h4 className="font-medium text-on-surface mb-2">School Details</h4>
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="text-on-surface-variant">Location:</span>{' '}
                            <span className="text-on-surface">{school.location}</span>
                        </p>
                        <p>
                            <span className="text-on-surface-variant">School ID:</span> <span className="text-on-surface">{school.id}</span>
                        </p>
                    </div>
                </div>
                <div>
                    <h4 className="font-medium text-on-surface mb-2">Statistics</h4>
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="text-on-surface-variant">Total Clubs:</span>{' '}
                            <span className="text-on-surface">{school.clubCount}</span>
                        </p>
                        <p>
                            <span className="text-on-surface-variant">Total Students:</span>{' '}
                            <span className="text-on-surface">{school.studentCount?.toLocaleString()}</span>
                        </p>
                    </div>
                </div>
                <div>
                    <h4 className="font-medium text-on-surface mb-2">Actions</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        <button className="px-3 py-2 text-sm font-medium border border-outline-variant text-on-surface rounded-md hover:bg-surface-variant transition-colors text-center cursor-pointer">
                            Edit Details
                        </button>
                        <button className="px-3 py-2 text-sm font-medium bg-primary text-on-primary rounded-md hover:bg-primary/90 transition-colors text-center cursor-pointer">
                            View Clubs
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
            showCreateButton={true}
            createButtonText="Add School"
            onCreateClick={() => console.log('Create school')}
            onRefresh={refetch}
            isRefreshing={isRefreshing}
        />
    );

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-on-surface mb-6">Schools Management</h1>
                <AdminTable
                    title="School Directory"
                    columns={columns}
                    items={filteredSchools}
                    renderExpandedContent={renderExpandedContent}
                    toolbar={toolbar}
                    emptyMessage="No schools found"
                />
            </div>
        </div>
    );
}
