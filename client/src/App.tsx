import { BrowserRouter, Routes, Route } from 'react-router';
import { Navbar } from './components/navbar/Navbar.tsx';
import { useAuth } from './hooks/useAuth';
import { Home } from './pages/Home';
import { MyClubs } from './pages/MyClubs';
import { Clubs } from './pages/Clubs';
import { Events } from './pages/Events';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { NotFound } from './pages/NotFound';

export function App() {
    const { isAuthenticated, toggleAuth } = useAuth();

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-background">
                <Navbar
                    isAuthenticated={isAuthenticated}
                    toggleAuth={toggleAuth}
                />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/my-clubs" element={<MyClubs />} />
                    <Route path="/clubs" element={<Clubs />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
