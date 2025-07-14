import { useState } from 'react';
import {
    Settings,
    Mail,
    Lock,
    User,
    GraduationCap,
    School,
    Calendar,
    Monitor,
    Moon,
    Sun,
    Trash2,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function Account() {
    const { theme, setTheme } = useTheme();
    const [formData, setFormData] = useState({
        name: 'John Doe',
        email: 'john.doe@university.edu',
        school: 'University of California, San Diego',
        major: 'Computer Science',
        educationType: 'undergraduate' as 'undergraduate' | 'graduate',
        year: 'third' as
            | 'first'
            | 'second'
            | 'third'
            | 'fourth'
            | 'more-than-4',
    });

    const [majorInput, setMajorInput] = useState('Computer Science');
    const [showMajorDropdown, setShowMajorDropdown] = useState(false);

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

    const filteredMajors = majors.filter(major =>
        major.toLowerCase().includes(majorInput.toLowerCase())
    );

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

    const getThemeIcon = () => {
        switch (theme) {
            case 'light':
                return <Sun className="w-4 h-4" />;
            case 'dark':
                return <Moon className="w-4 h-4" />;
            case 'system':
                return <Monitor className="w-4 h-4" />;
            default:
                return <Monitor className="w-4 h-4" />;
        }
    };

    const getThemeLabel = () => {
        switch (theme) {
            case 'light':
                return 'Light';
            case 'dark':
                return 'Dark';
            case 'system':
                return 'System';
            default:
                return 'System';
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

    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
                        <Settings className="w-8 h-8" />
                        Account Settings
                    </h1>
                    <p className="text-on-surface-variant mt-2">
                        Manage your account preferences and personal information
                    </p>
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
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left text-on-surface-variant hover:text-on-surface hover:bg-surface-variant"
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
                        <div
                            id="personal"
                            className="bg-surface rounded-lg shadow border border-outline-variant"
                        >
                            <div className="px-6 py-4 border-b border-outline-variant">
                                <h2 className="text-lg font-medium text-on-surface flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Personal Information
                                </h2>
                            </div>
                            <div className="px-6 py-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-on-surface mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e =>
                                                handleInputChange(
                                                    'name',
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-outline-variant rounded-md bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-on-surface mb-2">
                                            School
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.school}
                                            onChange={e =>
                                                handleInputChange(
                                                    'school',
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-outline-variant rounded-md bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-on-surface mb-2">
                                            Major
                                        </label>
                                        <input
                                            type="text"
                                            value={majorInput}
                                            onChange={e => {
                                                setMajorInput(e.target.value);
                                                setShowMajorDropdown(true);
                                                handleInputChange(
                                                    'major',
                                                    e.target.value
                                                );
                                            }}
                                            onFocus={() =>
                                                setShowMajorDropdown(true)
                                            }
                                            onBlur={() =>
                                                setTimeout(
                                                    () =>
                                                        setShowMajorDropdown(
                                                            false
                                                        ),
                                                    200
                                                )
                                            }
                                            placeholder="Type to search majors..."
                                            className="w-full px-3 py-2 border border-outline-variant rounded-md bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        />
                                        {showMajorDropdown &&
                                            filteredMajors.length > 0 && (
                                                <div className="absolute z-10 w-full mt-1 bg-surface border border-outline-variant rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                    {filteredMajors.map(
                                                        major => (
                                                            <button
                                                                key={major}
                                                                type="button"
                                                                onClick={() => {
                                                                    setMajorInput(
                                                                        major
                                                                    );
                                                                    handleInputChange(
                                                                        'major',
                                                                        major
                                                                    );
                                                                    setShowMajorDropdown(
                                                                        false
                                                                    );
                                                                }}
                                                                className="w-full text-left px-3 py-2 hover:bg-primary-container text-on-surface hover:text-on-primary-container transition-colors"
                                                            >
                                                                {major}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-on-surface mb-2">
                                            Education Type
                                        </label>
                                        <select
                                            value={formData.educationType}
                                            onChange={e =>
                                                handleInputChange(
                                                    'educationType',
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-outline-variant rounded-md bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        >
                                            <option value="undergraduate">
                                                Undergraduate
                                            </option>
                                            <option value="graduate">
                                                Graduate
                                            </option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-on-surface mb-2">
                                            Academic Year
                                        </label>
                                        <div className="inline-flex bg-surface-variant rounded-lg p-1 border border-outline-variant flex-wrap gap-1">
                                            {[
                                                'first',
                                                'second',
                                                'third',
                                                'fourth',
                                                'more-than-4',
                                            ].map(yearOption => (
                                                <button
                                                    key={yearOption}
                                                    onClick={() =>
                                                        handleInputChange(
                                                            'year',
                                                            yearOption
                                                        )
                                                    }
                                                    className={`
                                                        px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                                                        ${
                                                            formData.year ===
                                                            yearOption
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
                                    <button className="bg-primary text-on-primary px-4 py-2 rounded-md hover:bg-primary/90 font-medium">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Appearance */}
                        <div
                            id="appearance"
                            className="bg-surface rounded-lg shadow border border-outline-variant"
                        >
                            <div className="px-6 py-4 border-b border-outline-variant">
                                <h2 className="text-lg font-medium text-on-surface flex items-center gap-2">
                                    <Monitor className="w-5 h-5" />
                                    Appearance
                                </h2>
                            </div>
                            <div className="px-6 py-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium text-on-surface mb-2">
                                            Theme
                                        </h3>
                                        <p className="text-sm text-on-surface-variant mb-4">
                                            Choose how the interface looks.
                                            System follows your device settings.
                                        </p>
                                    </div>

                                    <div className="inline-flex bg-surface-variant rounded-lg p-1 border border-outline-variant">
                                        {[
                                            {
                                                value: 'light',
                                                label: 'Light',
                                                icon: (
                                                    <Sun className="w-4 h-4" />
                                                ),
                                            },
                                            {
                                                value: 'dark',
                                                label: 'Dark',
                                                icon: (
                                                    <Moon className="w-4 h-4" />
                                                ),
                                            },
                                            {
                                                value: 'system',
                                                label: 'System',
                                                icon: (
                                                    <Monitor className="w-4 h-4" />
                                                ),
                                            },
                                        ].map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() =>
                                                    setTheme(
                                                        option.value as
                                                            | 'light'
                                                            | 'dark'
                                                            | 'system'
                                                    )
                                                }
                                                className={`
                                                    flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                                                    ${
                                                        theme === option.value
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
                        <div
                            id="security"
                            className="bg-surface rounded-lg shadow border border-outline-variant"
                        >
                            <div className="px-6 py-4 border-b border-outline-variant">
                                <h2 className="text-lg font-medium text-on-surface flex items-center gap-2">
                                    <Lock className="w-5 h-5" />
                                    Account
                                </h2>
                            </div>
                            <div className="px-6 py-6 space-y-4">
                                <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-on-surface-variant" />
                                        <div>
                                            <h3 className="font-medium text-on-surface">
                                                Email Address
                                            </h3>
                                            <p className="text-sm text-on-surface-variant">
                                                {formData.email}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 rounded-md text-sm font-medium bg-secondary text-on-secondary hover:bg-secondary/90 transition-colors">
                                        Change
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Lock className="w-5 h-5 text-on-surface-variant" />
                                        <div>
                                            <h3 className="font-medium text-on-surface">
                                                Password
                                            </h3>
                                            <p className="text-sm text-on-surface-variant">
                                                Last changed 3 months ago
                                            </p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 rounded-md text-sm font-medium bg-secondary text-on-secondary hover:bg-secondary/90 transition-colors">
                                        Change
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div
                            id="danger"
                            className="bg-surface rounded-lg shadow border border-outline-variant"
                        >
                            <div className="px-6 py-4 border-b border-outline-variant">
                                <h2 className="text-lg font-medium text-on-surface flex items-center gap-2">
                                    <Trash2 className="w-5 h-5 text-error" />
                                    Danger Zone
                                </h2>
                            </div>
                            <div className="px-6 py-6">
                                <div className="rounded-lg p-6 bg-error-container">
                                    <h4 className="font-medium text-on-error-container mb-2 flex items-center gap-2">
                                        <Trash2 className="w-4 h-4" />
                                        Delete Account
                                    </h4>
                                    <p className="text-on-error-container text-sm mb-6">
                                        Permanently delete your account and all
                                        associated data. This action cannot be
                                        undone. You will lose access to all
                                        clubs, events, and personal information.
                                    </p>

                                    <div className="flex items-center justify-between p-4 border border-error-container rounded-lg bg-surface">
                                        <div>
                                            <h5 className="font-medium text-error mb-1">
                                                Delete My Account
                                            </h5>
                                            <p className="text-on-error-container text-sm">
                                                This will permanently delete
                                                your account and all data
                                                associated with it.
                                            </p>
                                        </div>
                                        <button className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-error text-on-error hover:bg-error/90 transition-colors cursor-pointer">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
