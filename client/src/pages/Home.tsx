import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { AuthenticatedHome } from '../features/home';
import { LandingPage } from '../features/home';

export function Home() {
    const { isAuthenticated, isInitialized } = useAuthStore();

    // Show loading while auth is initializing
    if (!isInitialized) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-on-surface-variant">Loading...</p>
                </div>
            </div>
        );
    }

    // Route to appropriate component based on auth status
    return isAuthenticated ? <AuthenticatedHome /> : <LandingPage />;
}
