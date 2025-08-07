import { useState } from 'react';
import { Link } from 'react-router';

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

    const inputClass =
        'mt-1 block w-full rounded-md text-on-primary-container border border-outline-variant bg-surface px-3 py-2 shadow-sm ' +
        'focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 focus:outline-none';

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const newErrors: { [key: string]: string } = {};

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName) newErrors.fullName = 'Full name is required';
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        if (confirmPassword != password) newErrors.confirmPassword = 'Passwords do not match';
        if (!school) newErrors.school = 'School is required';
        if (!major) newErrors.major = 'Major is required';
        if (!educationType) newErrors.educationType = 'Education Type is required';
        if (!year) newErrors.year = 'Academic Year is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
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
            }
        } catch (error) {
            console.error('Error creating account:', error);
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
                                    required
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    className={inputClass + ' ' + (errors.fullName ? 'border-red-500' : '')}
                                />
                                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-on-surface">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className={inputClass + ' ' + (errors.email ? 'border-red-500' : '')}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-on-surface">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-outline-variant rounded-md shadow-sm bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-primary focus:border-primary"
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-on-surface">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-outline-variant rounded-md shadow-sm bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-primary focus:border-primary"
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{newErrors.confirmPassword}</p>}
                            </div>

                            <div>
                                <label htmlFor="school" className="block text-sm font-medium text-on-surface">
                                    School
                                </label>
                                <input
                                    id="school"
                                    name="school"
                                    type="text"
                                    required
                                    value={school}
                                    onChange={e => setSchool(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-outline-variant rounded-md shadow-sm bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-primary focus:border-primary"
                                />
                                {errors.school && <p className="text-red-500 text-sm mt-1">{errors.school}</p>}
                            </div>

                            <div>
                                <label htmlFor="major" className="block text-sm font-medium text-on-surface">
                                    Major
                                </label>
                                <input
                                    id="major"
                                    name="major"
                                    type="text"
                                    required
                                    value={major}
                                    onChange={e => setMajor(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-outline-variant rounded-md shadow-sm bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-primary focus:border-primary"
                                />
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
                                    className="mt-1 block w-full px-3 py-2 border border-outline-variant rounded-md shadow-sm bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-primary focus:border-primary"
                                >
                                    <option className="text-on-background-variant" value="">
                                        Select your education type
                                    </option>
                                    <option value="Undergraduate">Undergraduate</option>
                                    <option value="Graduate">Graduate</option>
                                </select>
                                {errors.educationType && <p className="text-red-500 text-sm mt-1">{errors.educationType}</p>}
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
                                {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-on-primary bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
