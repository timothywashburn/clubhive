import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Navbar } from './components/navbar/Navbar.tsx';
import { Footer } from './components/footer/Footer.tsx';
import { useAuth } from './hooks/useAuth';
import { Home } from './pages/Home';
import { MyClubs } from './features/my-clubs';
import { Clubs } from './pages/Clubs';
import { ClubProfile } from './pages/ClubProfile';
import { Events } from './pages/Events';
import { Notifications } from './pages/Notifications';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { NotFound } from './pages/NotFound';
import { Account } from './pages/Account.tsx';
import { About } from './features/about/About.tsx';
import { StaticHoneycomb } from './components/honeycomb';

export function App() {
    const { isAuthenticated, toggleAuth } = useAuth();
    const [scrollY, setScrollY] = useState(0);
    const backgroundRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-background flex flex-col">
                <div
                    ref={backgroundRef}
                    className="fixed"
                    style={{
                        top: 0,
                        left: '0',
                        right: '0',
                        height: '150vh',
                        transform: `translateY(${scrollY * -0.05}px)`,
                    }}
                >
                    <StaticHoneycomb />
                </div>
                <Navbar isAuthenticated={isAuthenticated} toggleAuth={toggleAuth} />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/my-clubs" element={<MyClubs />} />
                        <Route path="/clubs" element={<Clubs />} />
                        <Route path="/club-profile/:id" element={<ClubProfile />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
