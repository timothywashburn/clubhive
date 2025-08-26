import React from 'react';
import { useAuthStore } from '../stores/authStore.ts';
import { HomePage } from '../features/home';
import { LandingPage } from '../features/home';

export function RootPage() {
    const { isAuthenticated, isInitialized } = useAuthStore();
    if (!isInitialized) return;
    return isAuthenticated ? <HomePage /> : <LandingPage />;
}
