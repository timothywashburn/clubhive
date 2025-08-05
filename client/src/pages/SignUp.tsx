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
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        school: '',
        major: '',
        educationType: '',
        year: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const newErrors: { [key: string]: string } = {};

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.confirmPassword != formData.password) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.school) newErrors.school = 'School is required';
        if (!formData.major) newErrors.major = 'Major is required';
        if (!formData.educationType) newErrors.educationType = 'Education Type is required';
        if (!formData.year) newErrors.year = 'Academic Year is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const userData = {
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            school: formData.school,
            major: formData.major,
            educationType: formData.educationType,
            year: formData.year,
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
                                    value={formData.fullName}
                                    onChange={e => handleChange('fullName', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-outline-variant rounded-md shadow-sm bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-primary focus:border-primary"
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
                                    required
                                    value={formData.email}
                                    onChange={e => handleChange('email', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-outline-variant rounded-md shadow-sm bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-primary focus:border-primary"
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
                                    required
                                    value={formData.password}
                                    onChange={e => handleChange('password', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-outline-variant rounded-md shadow-sm bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-primary focus:border-primary"
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
                                    required
                                    value={formData.confirmPassword}
                                    onChange={e => handleChange('confirmPassword', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-outline-variant rounded-md shadow-sm bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>

                            <div>
                                <label htmlFor="school" className="block text-sm font-medium text-on-surface">
                                    School
                                </label>
                                <input
                                    id="school"
                                    name="school"
                                    type="school"
                                    required
                                    value={formData.school}
                                    onChange={e => handleChange('school', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-outline-variant rounded-md shadow-sm bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>

                            <div>
                                <label htmlFor="major" className="block text-sm font-medium text-on-surface">
                                    Major
                                </label>
                                <input
                                    id="major"
                                    name="major"
                                    type="major"
                                    required
                                    value={formData.major}
                                    onChange={e => handleChange('major', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-outline-variant rounded-md shadow-sm bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>

                            <div>
                                <label htmlFor="educationType" className="block text-sm font-medium text-on-surface">
                                    Education Type
                                </label>
                                <select
                                    id="educationType"
                                    name="educationType"
                                    //type="educationType"
                                    required
                                    value={formData.educationType}
                                    onChange={e => handleChange('educationType', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-outline-variant rounded-md shadow-sm bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-primary focus:border-primary"
                                >
                                    <option value="undergraduate">Undergraduate</option>
                                    <option value="graduate">Graduate</option>
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-on-surface mb-2">Academic Year</label>
                            <div className="inline-flex bg-surface-variant rounded-lg p-1 border border-outline-variant flex-wrap gap-1">
                                {['first', 'second', 'third', 'fourth', 'more-than-4'].map(yearOption => (
                                    <button
                                        key={yearOption}
                                        onClick={() => handleChange('year', yearOption)}
                                        className={`
                                                        px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
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
