import { create } from 'zustand';

interface User {
    id: string;
    name: string;
    email: string;
    school: string;
    major: string;
    educationType: string;
    year: string;
}

interface AuthError {
    [key: string]: string;
}

interface AuthStore {
    isAuthenticated: boolean;
    user: User | null;
    errors: AuthError;

    initializeAuth: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    createAccount: (userData: {
        name: string;
        email: string;
        password: string;
        school: string;
        major: string;
        educationType: string;
        year: string;
    }) => Promise<void>;
    signOut: () => Promise<void>;
    clearErrors: () => void;
    checkToken: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    isAuthenticated: false,
    user: null,
    errors: {},

    initializeAuth: async () => {
        try {
            const response = await fetch('/api/user/check-token', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    set({
                        isAuthenticated: true,
                        user: null, // User data can be fetched separately when needed
                        errors: {},
                    });
                    return;
                }
            }

            set({ isAuthenticated: false, user: null });
        } catch (error) {
            console.error('Error initializing auth:', error);
            set({ isAuthenticated: false, user: null });
        }
    },

    signIn: async (email: string, password: string) => {
        set({ isAuthenticated: false, errors: {} });

        const newErrors: AuthError = {};
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            set({ isAuthenticated: false, errors: newErrors });
            return;
        }

        try {
            const response = await fetch('/api/user/sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (result.success) {
                set({
                    isAuthenticated: true,
                    user: result.user,
                    errors: {},
                });
            } else {
                if (response.status === 409) {
                    newErrors.submit = 'Email is not registered';
                } else if (response.status === 401) {
                    newErrors.submit = 'Incorrect password';
                } else {
                    newErrors.submit = result.message || 'Login failed';
                }
                set({ isAuthenticated: false, errors: newErrors });
            }
        } catch (error) {
            console.error('Error signing in:', error);
            set({
                isAuthenticated: false,
                errors: { submit: 'Network error occurred' },
            });
        }
    },

    createAccount: async userData => {
        set({ isAuthenticated: false, errors: {} });

        const newErrors: AuthError = {};
        if (!userData.name) newErrors.name = 'Full name is required';
        if (!userData.email) newErrors.email = 'Email is required';
        if (!userData.password) newErrors.password = 'Password is required';
        if (!userData.school) newErrors.school = 'School is required';
        if (!userData.major) newErrors.major = 'Major is required';
        if (!userData.educationType) newErrors.educationType = 'Education type is required';
        if (!userData.year) newErrors.year = 'Academic year is required';

        if (Object.keys(newErrors).length > 0) {
            set({ isAuthenticated: false, errors: newErrors });
            return;
        }

        try {
            const response = await fetch('/api/user/create-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (result.success) {
                await get().signIn(userData.email, userData.password);
            } else {
                if (response.status === 409) {
                    newErrors.submit = 'Email is already registered';
                } else {
                    newErrors.submit = result.message || 'Account creation failed';
                }
                set({ isAuthenticated: false, errors: newErrors });
            }
        } catch (error) {
            console.error('Error creating account:', error);
            set({
                isAuthenticated: false,
                errors: { submit: 'Network error occurred' },
            });
        }
    },

    signOut: async () => {
        try {
            await fetch('/api/user/sign-out', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            set({
                isAuthenticated: false,
                user: null,
                errors: {},
            });
        }
    },

    clearErrors: () => {
        set({ errors: {} });
    },

    checkToken: async () => {
        const response = await fetch('/api/user/check-token', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const result = await response.json();

        if (result.success) {
            set({
                isAuthenticated: true,
                user: null,
                errors: {},
            });
        }
    },
}));
