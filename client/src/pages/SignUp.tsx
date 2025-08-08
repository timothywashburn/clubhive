import { useState } from 'react';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import { useToast } from '../hooks/useToast';

/**
 * THIS CLASS IS AI GENERATED AND TEMPORARY
 *
 * This class is a placeholder that bears no resemblance to the real
 * implementation for this page. This code is temporary and can be
 * replaced by the real implementation at any time.
 */
export function SignUp() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [school, setSchool] = useState('');
    const [major, setMajor] = useState('');
    const [educationType, setEducationType] = useState('');
    const [year, setYear] = useState('');

    const navigate = useNavigate();

    const inputClass =
        'mt-1 block w-full rounded-md text-on-primary-container border border-outline-variant bg-surface px-3 py-2 shadow-sm ' +
        'focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 focus:outline-none';

    const [majorInput, setMajorInput] = useState('');
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

    const filteredMajors = majors.filter(major => major.toLowerCase().includes(majorInput.toLowerCase()));

    const { errorToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName) {
            errorToast('Full name is required');
            return;
        }
        if (!email) {
            errorToast('Email is required');
            return;
        }
        if (!password) {
            errorToast('Password is required');
            return;
        }
        if (confirmPassword !== password) {
            errorToast('Passwords do not match');
            return;
        }
        if (!school) {
            errorToast('School is required');
            return;
        }
        if (!major) {
            errorToast('Major is required');
            return;
        }
        if (!educationType) {
            errorToast('Education Type is required');
            return;
        }
        if (!year) {
            errorToast('Academic Year is required');
            return;
        }

        const userData = {
            name: fullName,
            email: email,
            password: password,
            school: school,
            major: major,
            educationType: educationType,
            year: year,
        };
        {
            /* creating account */
        }
        try {
            const res = await fetch('/api/user/create-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const result = await res.json();
            if (result.success) {
                console.log('Account created successfully:', result.user);

                try {
                    const res = await fetch('/api/user/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: email, password: password }),
                    });
                    const result = await res.json();
                    if (result.success) {
                        console.log('Logged in successfully:', result.user);
                        {
                            /* redirect to home page */
                        }
                        navigate('/');

                        {
                            /* switch navbar */
                        }
                    }
                } catch (error) {
                    console.error('Error logging after creating account:', error);
                    setErrors(error.message);
                }
            } else {
                if (res.status === 409) {
                    newErrors.submit = 'Email is already registered';
                    setErrors(newErrors);
                    return;
                }
            }
        } catch (error) {
            console.error('Error creating account:', error);
            return;
        }

        {
            /* logging in */
        }
    };

    const getYearLabel = (year: string) => {
        switch (year) {
            case '1':
                return '1st Year';
            case '2':
                return '2nd Year';
            case '3':
                return '3rd Year';
            case '4':
                return '4th Year';
            case '>4':
                return '4+ Year';
            default:
                return year;
        }
    };

    return (
        <div className="h-full relative">
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-bold text-on-surface">Create your account</h2>
                        <p className="mt-2 text-center text-sm text-on-surface-variant">
                            Already have an account?{' '}
                            <Link to="/signin" className="font-medium text-primary hover:text-primary/90">
                                Sign in
                            </Link>
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-on-surface">
                                    Full Name
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-on-surface">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-on-surface">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className={inputClass + ' ' + (errors.password ? 'border-red-500' : '')}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-on-surface">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className={inputClass + ' ' + (errors.confirmPassword ? 'border-red-500' : '')}
                                />
                            </div>

                            <div>
                                <label htmlFor="school" className="block text-sm font-medium text-on-surface">
                                    School
                                </label>
                                <select
                                    id="school"
                                    name="school"
                                    value={school}
                                    onChange={e => setSchool(e.target.value)}
                                    className={inputClass + ' ' + (errors.school ? 'border-red-500' : '')}
                                >
                                    <option className="text-on-background-variant" value="">
                                        Select your school
                                    </option>
                                    <option value="507f1f77bcf86cd799439021">UCSD</option> {/* ucsd school id */}
                                </select>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-on-surface mb-2">Major</label>
                                <input
                                    type="text"
                                    value={majorInput}
                                    onChange={e => {
                                        setMajorInput(e.target.value);
                                        setShowMajorDropdown(true);
                                        setMajor(e.target.value);
                                    }}
                                    onFocus={() => setShowMajorDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowMajorDropdown(false), 200)}
                                    placeholder="Type to search majors..."
                                    className={inputClass + ' ' + (errors.major ? 'border-red-500' : '')}
                                />
                                {showMajorDropdown && filteredMajors.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-surface border border-outline-variant rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {filteredMajors.map(major => (
                                            <button
                                                key={major}
                                                type="button"
                                                onClick={() => {
                                                    setMajorInput(major);
                                                    setMajor(major);
                                                    setShowMajorDropdown(false);
                                                }}
                                                className="w-full text-left px-3 py-2 hover:bg-primary-container text-on-surface hover:text-on-primary-container transition-colors"
                                            >
                                                {major}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {errors.major && <p className="text-red-500 text-sm mt-1">{errors.major}</p>}
                            </div>

                            <div>
                                <label htmlFor="educationType" className="block text-sm font-medium text-on-surface">
                                    Education Type
                                </label>
                                <select
                                    id="educationType"
                                    name="educationType"
                                    value={educationType}
                                    onChange={e => setEducationType(e.target.value)}
                                    className={inputClass + ' ' + (errors.educationType ? 'border-red-500' : '')}
                                >
                                    <option className="text-on-background-variant" value="">
                                        Select your education type
                                    </option>
                                    <option value="Undergraduate">Undergraduate</option>
                                    <option value="Graduate">Graduate</option>
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-on-surface mb-2">Academic Year</label>
                            <div className="inline-flex bg-surface-variant rounded-lg p-1 border border-outline-variant flex-wrap gap-1">
                                {['1', '2', '3', '4', '>4'].map(yearOption => (
                                    <button
                                        type="button"
                                        key={yearOption}
                                        value={year}
                                        onClick={() => setYear(yearOption)}
                                        className={`
                                                        px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                                                        ${
                                                            year === yearOption
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

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-on-primary bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Create Account
                            </button>
                            {errors.submit && <p className="text-red-500 text-sm mt-1">{errors.submit}</p>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
