import { BrowserRouter, Routes, Route } from 'react-router';
import { Navbar } from './components/navbar/Navbar.tsx';
import { useAuth } from './hooks/useAuth';
import { Home } from './pages/Home';
import { MyClubs } from './features/my-clubs';
import { Clubs } from './pages/Clubs';
import { Events } from './pages/Events';
import { EventsPage } from './pages/EventsPage';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { NotFound } from './pages/NotFound';

export function App() {
    const { isAuthenticated, toggleAuth } = useAuth();

    return (
        <BrowserRouter>
            <div className="h-screen bg-background flex flex-col">
                <Navbar
                    isAuthenticated={isAuthenticated}
                    toggleAuth={toggleAuth}
                />
                <main className="flex-1 overflow-auto">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/my-clubs" element={<MyClubs />} />
                        <Route path="/clubs" element={<Clubs />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/events/:id" element={<EventsPage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route
                            path="/notifications"
                            element={<Notifications />}
                        />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
