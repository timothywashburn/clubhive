import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UnifiedNavigation } from './components/navigation';
import { Footer } from './components/footer/Footer.tsx';
import { useTheme } from './hooks/useTheme';
import { Home } from './pages/Home';
import { MyClubs } from './features/my-clubs';
import { Clubs } from './pages/ClubSearch.tsx';
import { ClubProfile } from './pages/ClubProfile';
import { ClubRegistration } from './pages/ClubRegistration.tsx';
import { Events } from './pages/Events';
import { EventsPage } from './pages/EventsPage';
import { Notifications } from './pages/Notifications';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { NotFound } from './pages/NotFound';
import { Account } from './pages/Account.tsx';
import { About } from './features/about/About.tsx';
import { SendNotification } from './pages/SendNotification.tsx';
import { AdminDashboard, AdminSchools, AdminClubs, AdminUsers } from './pages/admin';
import { StaticHoneycomb } from './components/honeycomb';
import { useThemeStore } from './stores/themeStore.ts';
import { useAuthStore } from './stores/authStore.ts';

import { TestImages } from './pages/TestImages.tsx';

function AppContent() {
    const { initializeAuth, isAuthenticated } = useAuthStore();
    const [scrollY, setScrollY] = useState(0);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLElement>(null);
    const location = useLocation();
    useTheme();
    const { theme } = useThemeStore();
    const [siteNavType, setSiteNavType] = useState<'regular' | 'admin'>('regular');

    const toggleSiteNavType = () => {
        setSiteNavType(prev => (prev === 'regular' ? 'admin' : 'regular'));
    };

    useEffect(() => {
        const handleScroll = () => {
            if (mainRef.current) {
                setScrollY(mainRef.current.scrollTop);
            }
        };

        const timer = setTimeout(() => {
            if (mainRef.current) {
                mainRef.current.addEventListener('scroll', handleScroll);
            }
        }, 0);

        return () => {
            clearTimeout(timer);
            if (mainRef.current) {
                mainRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    if (!theme) return null;

    return (
        <div className="h-screen flex flex-col">
            <div
                ref={backgroundRef}
                className="fixed"
                style={{
                    top: 0,
                    left: '0',
                    right: '0',
                    height: '150vh',
                    zIndex: -1,
                }}
            >
                <StaticHoneycomb y={scrollY * -0.05} />
            </div>
            <UnifiedNavigation
                navType="site"
                siteNavType={siteNavType}
                isAuthenticated={isAuthenticated}
                toggleSiteNavType={toggleSiteNavType}
                activeRoute={location.pathname}
            />
            <main
                ref={mainRef}
                className={`flex-1 overflow-auto flex flex-col ${location.pathname === '/' && !isAuthenticated ? 'scrollbar-hide' : ''}`}
            >
                <div className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/my-clubs" element={<MyClubs />} />
                        <Route path="/my-clubs/:clubUrl/:tab" element={<MyClubs />} />
                        <Route path="/clubs" element={<Clubs />} />
                        <Route path="/club-profile/:url" element={<ClubProfile />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/events/:id" element={<EventsPage />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/register" element={<ClubRegistration />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/schools" element={<AdminSchools />} />
                        <Route path="/admin/clubs" element={<AdminClubs />} />
                        <Route path="/admin/users" element={<AdminUsers />} />
                        <Route path="/send-notification" element={<SendNotification />} />
                        <Route path="/test-images" element={<TestImages />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
                {!(location.pathname === '/' && !isAuthenticated) && <Footer />}
            </main>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme === 'dark' ? 'dark' : 'light'}
            />
        </div>
    );
}

export function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
