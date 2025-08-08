import { useState } from 'react';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { UnifiedNavigationProps } from '../components/navigation/types.ts';
import { useToast } from '../hooks/useToast';

/**
 * THIS CLASS IS AI GENERATED AND TEMPORARY
 *
 * This class is a placeholder that bears no resemblance to the real
 * implementation for this page. This code is temporary and can be
 * replaced by the real implementation at any time.
 */
export function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { errorToast } = useToast();

    const inputClass =
        'mt-1 block w-full rounded-md text-on-primary-container border border-outline-variant bg-surface px-3 py-2 shadow-sm ' +
        'focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 focus:outline-none';

    const { isAuthenticated, toggleAuth } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const userData = {
            email: email,
            password: password,
        };

        try {
            const res = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const result = await res.json();
            if (result.success) {
                console.log('Logged in successfully:', result.user);

                {
                    /* redirect to home page */
                }
                navigate('/');

                {
                    /*props.toggleAuth;*/
                }
            } else {
                if (res.status === 409) {
                    console.log('Email is not registered');
                    errorToast('Email is not registered');
                    return;
                }
                if (res.status === 401) {
                    console.log('Incorrect password');
                    errorToast('Incorrect password');
                    return;
                }
            }
        } catch (error) {
            console.error('Error logging in:', error);
            errorToast('Failed to sign in. Please try again.');
        }
    };

    return (
        <div className="h-full relative">
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-bold text-on-surface">Sign in to your account</h2>
                        <p className="mt-2 text-center text-sm text-on-surface-variant">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-medium text-primary hover:text-primary/90">
                                Create account
                            </Link>
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
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
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className={inputClass + ' ' + (errors.password ? 'border-red-500' : '')}
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-on-surface">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary hover:text-primary/90">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-on-primary bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Sign in
                            </button>
                            {errors.submit && <p className="text-red-500 text-sm mt-1">{errors.submit}</p>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
