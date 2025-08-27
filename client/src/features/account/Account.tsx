import { useState, useEffect } from 'react';
import { Settings, Mail, Lock, User, Monitor, Moon, Sun, Trash2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ThemePreference, useThemeStore } from '../../stores/themeStore.ts';
import { useAuthStore } from '../../stores/authStore.ts';
import { DeleteDangerZone } from '../../components/DangerZone.tsx';
import { useToast } from '../../hooks/useToast.ts';

export function Account() {
    const { preference, setPreference } = useThemeStore();
    const { signOut } = useAuthStore();
    const navigate = useNavigate();

    const [loadingProfile, setLoadingProfile] = useState(true);
    const [saving, setSaving] = useState(false);
    const { errorToast, successToast } = useToast();

    const [emailEditing, setEmailEditing] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [emailSaving, setEmailSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: 'John Doe',
        email: 'john.doe@university.edu',
        school: 'University of California, San Diego',
        major: 'Computer Science',
        educationType: 'Undergraduate' as 'Undergraduate' | 'Graduate',
        year: 'third' as 'first' | 'second' | 'third' | 'fourth' | 'more-than-4',
    });

    const [schoolId, setSchoolId] = useState<string | null>(null);
    const [majorInput, setMajorInput] = useState('Computer Science');
    const [showMajorDropdown, setShowMajorDropdown] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const majors = [
        'Accounting',
        'Aerospace Engineering',
        'Anthropology',
        'Applied Mathematics',
        'Architecture',
        'Art History',
        'Biology',
        'Biomedical Engineering',
        'Business Administration',
        'Chemical Engineering',
        'Chemistry',
        'Civil Engineering',
        'Computer Engineering',
        'Computer Science',
        'Creative Writing',
        'Criminal Justice',
        'Data Science',
        'Economics',
        'Electrical Engineering',
        'English Literature',
        'Environmental Science',
        'Finance',
        'Fine Arts',
        'History',
        'Information Systems',
        'International Relations',
        'Journalism',
        'Kinesiology',
        'Liberal Arts',
        'Marketing',
        'Mathematics',
        'Mechanical Engineering',
        'Music',
        'Neuroscience',
        'Nursing',
        'Philosophy',
        'Physics',
        'Political Science',
        'Psychology',
        'Public Health',
        'Sociology',
        'Software Engineering',
        'Theater Arts',
        'Urban Planning',
    ];

    const filteredMajors = majors.filter(major => major.toLowerCase().includes(majorInput.toLowerCase()));

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const navigationItems = [
        {
            id: 'personal',
            label: 'Personal Information',
            icon: <User className="w-5 h-5" />,
        },
        {
            id: 'appearance',
            label: 'Appearance',
            icon: <Monitor className="w-5 h-5" />,
        },
        {
            id: 'security',
            label: 'Account',
            icon: <Lock className="w-5 h-5" />,
        },
        {
            id: 'danger',
            label: 'Danger Zone',
            icon: <Trash2 className="w-5 h-5" />,
        },
    ];

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    const getYearLabel = (year: string) => {
        switch (year) {
            case 'first':
                return '1st Year';
            case 'second':
                return '2nd Year';
            case 'third':
                return '3rd Year';
            case 'fourth':
                return '4th Year';
            case 'more-than-4':
                return '4+ Years';
            default:
                return year;
        }
    };

    const handleChangeEmail = async () => {
        if (!newEmail || emailSaving) return;

        setEmailSaving(true);

        try {
            const res = await fetch('/api/user/change-email', {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newEmail,
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                throw new Error(body?.error?.message || `Failed to change email: ${res.status}`);
            }

            successToast('Email updated successfully');
            setFormData(prev => ({ ...prev, email: newEmail }));
            setEmailEditing(false);
        } catch (error) {
            console.error('Error changing email:', error);
            errorToast('Failed to change email');
        } finally {
            setEmailSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteLoading) return;

        const confirmed = window.confirm(
            'This will permanently delete your account and all associated data. This action cannot be undone.\n\nDo you want to continue?'
        );
        if (!confirmed) return;

        setDeleteLoading(true);
        try {
            const res = await fetch('/api/me/delete-account', {
                method: 'DELETE',
                credentials: 'include', // keep if you use cookies
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                throw new Error(body?.error?.message || `Request failed: ${res.status}`);
            }

            console.log('Deleting account...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert('Account deleted successfully');

            await signOut();
            navigate('/signin');
        } catch (error) {
            console.error('Error deleting account:', error);
            errorToast('Failed to delete account');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/signin');
    };

    const handleSaveChanges = async () => {
        if (saving) return;
        setSaving(true);

        try {
            const yearMap: Record<'first' | 'second' | 'third' | 'fourth' | 'more-than-4', '1' | '2' | '3' | '4' | '>4'> = {
                first: '1',
                second: '2',
                third: '3',
                fourth: '4',
                'more-than-4': '>4',
            };

            const res = await fetch('/api/user', {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    school: schoolId,
                    major: majorInput,
                    educationType: formData.educationType,
                    year: yearMap[formData.year],
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                throw new Error(body?.error?.message || `Failed to save changes: ${res.status}`);
            }

            successToast('Changes saved successfully!');
        } catch (error) {
            console.error('Error saving changes:', error);
            errorToast('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/users/get-user', {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!res.ok) {
                    const body = await res.json().catch(() => null);
                    throw new Error(body?.error?.message || `Failed to load user: ${res.status}`);
                }

                const { user } = await res.json();

                const yearMap: Record<string, 'first' | 'second' | 'third' | 'fourth' | 'more-than-4'> = {
                    '1': 'first',
                    '2': 'second',
                    '3': 'third',
                    '4': 'fourth',
                    '>4': 'more-than-4',
                };

                setFormData({
                    name: user.name,
                    email: user.email,
                    school: user?.school && user.school.name,
                    major: user.major,
                    educationType: user.educationType,
                    year: yearMap[user.year],
                });

                setNewEmail(user.email);

                console.log('User email from API:', user.email);

                setMajorInput(user?.major || '');
                setSchoolId(user?.school?._id || (typeof user?.school === 'string' ? user.school : null));
            } catch (e) {
                console.error(e);
                alert((e as Error).message || 'Failed to load profile');
            } finally {
                setLoadingProfile(false);
            }
        })();
    }, []);

    return (
        <div className="h-full relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
                                <Settings className="w-8 h-8" />
                                Account Settings
                            </h1>
                            <p className="text-on-surface-variant mt-2">Manage your account preferences and personal information</p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-error text-on-error hover:bg-error/90 transition-colors cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Left Sidebar Navigation */}
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-surface rounded-lg shadow border border-outline-variant p-2 sticky top-8">
                            <nav className="space-y-1">
                                {navigationItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left text-on-surface-variant hover:text-on-surface hover:bg-surface-variant cursor-pointer"
                                    >
                                        {item.icon}
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        {/* Personal Information */}
                        <div id="personal" className="bg-surface rounded-lg shadow border border-outline-variant">
                            <div className="px-6 py-4 border-b border-outline-variant">
                                <h2 className="text-lg font-medium text-on-surface flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Personal Information
                                </h2>
                            </div>
                            <div className="px-6 py-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-on-surface mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => handleInputChange('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-outline-variant rounded-md bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-on-surface mb-2">School</label>
                                        <input
                                            type="text"
                                            value={formData.school}
                                            onChange={e => handleInputChange('school', e.target.value)}
                                            className="w-full px-3 py-2 border border-outline-variant rounded-md bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-on-surface mb-2">Major</label>
                                        <input
                                            type="text"
                                            value={majorInput}
                                            onChange={e => {
                                                setMajorInput(e.target.value);
                                                setShowMajorDropdown(true);
                                                handleInputChange('major', e.target.value);
                                            }}
                                            onFocus={() => setShowMajorDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowMajorDropdown(false), 200)}
                                            placeholder="Type to search majors..."
                                            className="w-full px-3 py-2 border border-outline-variant rounded-md bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        />
                                        {showMajorDropdown && filteredMajors.length > 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-surface border border-outline-variant rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                {filteredMajors.map(major => (
                                                    <button
                                                        key={major}
                                                        type="button"
                                                        onClick={() => {
                                                            setMajorInput(major);
                                                            handleInputChange('major', major);
                                                            setShowMajorDropdown(false);
                                                        }}
                                                        className="w-full text-left px-3 py-2 hover:bg-primary-container text-on-surface hover:text-on-primary-container transition-colors"
                                                    >
                                                        {major}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-on-surface mb-2">Education Type</label>
                                        <select
                                            value={formData.educationType}
                                            onChange={e => handleInputChange('educationType', e.target.value)}
                                            className="w-full px-3 py-2 border border-outline-variant rounded-md bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        >
                                            <option value="Undergraduate">Undergraduate</option>
                                            <option value="Graduate">Graduate</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-on-surface mb-2">Academic Year</label>
                                        <div className="inline-flex bg-surface-variant rounded-lg p-1 border border-outline-variant flex-wrap gap-1">
                                            {['first', 'second', 'third', 'fourth', 'more-than-4'].map(yearOption => (
                                                <button
                                                    key={yearOption}
                                                    onClick={() => handleInputChange('year', yearOption)}
                                                    className={`
                                                        px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer
                                                        ${
                                                            formData.year === yearOption
                                                                ? 'bg-primary text-on-primary shadow-sm'
                                                                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface'
                                                        }
                                                    `}
                                                >
                                                    {getYearLabel(yearOption)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={handleSaveChanges}
                                        disabled={saving || loadingProfile}
                                        className="bg-primary text-on-primary px-4 py-2 rounded-md hover:bg-primary/90 font-medium cursor-pointer"
                                    >
                                        {saving ? 'Saving…' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Appearance */}
                        <div id="appearance" className="bg-surface rounded-lg shadow border border-outline-variant">
                            <div className="px-6 py-4 border-b border-outline-variant">
                                <h2 className="text-lg font-medium text-on-surface flex items-center gap-2">
                                    <Monitor className="w-5 h-5" />
                                    Appearance
                                </h2>
                            </div>
                            <div className="px-6 py-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium text-on-surface mb-2">Theme</h3>
                                        <p className="text-sm text-on-surface-variant mb-4">
                                            Choose how the interface looks. System follows your device settings.
                                        </p>
                                    </div>

                                    <div className="inline-flex bg-surface-variant rounded-lg p-1 border border-outline-variant">
                                        {[
                                            {
                                                value: 'light',
                                                label: 'Light',
                                                icon: <Sun className="w-4 h-4" />,
                                            },
                                            {
                                                value: 'dark',
                                                label: 'Dark',
                                                icon: <Moon className="w-4 h-4" />,
                                            },
                                            {
                                                value: 'system',
                                                label: 'System',
                                                icon: <Monitor className="w-4 h-4" />,
                                            },
                                        ].map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => setPreference(option.value as ThemePreference)}
                                                className={`
                                                    flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer
                                                    ${
                                                        preference === option.value || (!preference && option.value === 'system')
                                                            ? 'bg-primary text-on-primary shadow-sm'
                                                            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface'
                                                    }
                                                `}
                                            >
                                                {option.icon}
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account */}
                        <div id="security" className="bg-surface rounded-lg shadow border border-outline-variant">
                            <div className="px-6 py-4 border-b border-outline-variant">
                                <h2 className="text-lg font-medium text-on-surface flex items-center gap-2">
                                    <Lock className="w-5 h-5" />
                                    Account
                                </h2>
                            </div>
                            <div className="px-6 py-6 space-y-4">
                                <div className="p-4 border border-outline-variant rounded-lg space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-on-surface-variant" />
                                        <h3 className="font-medium text-on-surface">Email Address</h3>
                                    </div>

                                    {!emailEditing ? (
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-on-surface-variant">{formData.email}</p>
                                            <button
                                                onClick={() => setEmailEditing(true)}
                                                className="px-4 py-2 rounded-md text-sm font-medium bg-secondary text-on-secondary hover:bg-secondary/90 transition-colors cursor-pointer"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <input
                                                type="email"
                                                value={newEmail}
                                                onChange={e => setNewEmail(e.target.value)}
                                                className="w-full px-3 py-2 border border-outline-variant rounded-md bg-surface text-on-surface"
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => setEmailEditing(false)}
                                                    className="px-3 py-1 text-sm text-on-surface-variant hover:text-on-surface hover:underline"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleChangeEmail}
                                                    disabled={emailSaving}
                                                    className="px-4 py-2 bg-primary text-on-primary rounded-md font-medium hover:bg-primary/90"
                                                >
                                                    {emailSaving ? 'Saving…' : 'Save'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Lock className="w-5 h-5 text-on-surface-variant" />
                                        <div>
                                            <h3 className="font-medium text-on-surface">Password</h3>
                                            <p className="text-sm text-on-surface-variant">Last changed 3 months ago</p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 rounded-md text-sm font-medium bg-secondary text-on-secondary hover:bg-secondary/90 transition-colors cursor-pointer">
                                        Change
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div id="danger">
                            <DeleteDangerZone
                                itemName={formData.name}
                                itemType="Account"
                                onDelete={handleDeleteAccount}
                                isDeleteLoading={deleteLoading}
                                customDescription="Permanently delete your account and all associated data. This action cannot be undone. You will lose access to all clubs, events, and personal information."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
