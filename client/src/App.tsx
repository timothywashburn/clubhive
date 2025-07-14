import { BrowserRouter, Routes, Route } from 'react-router';
import { Navbar } from './components/navbar/Navbar.tsx';
import { Footer } from './components/footer/Footer.tsx';
import { useAuth } from './hooks/useAuth';
import { Home } from './pages/Home';
import { MyClubs } from './features/my-clubs';
import { Clubs } from './pages/Clubs';
import { Events } from './pages/Events';
import { Notifications } from './pages/Notifications';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { NotFound } from './pages/NotFound';
import { Account } from './pages/Account.tsx';

export function App() {
    const { isAuthenticated, toggleAuth } = useAuth();

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar
                    isAuthenticated={isAuthenticated}
                    toggleAuth={toggleAuth}
                />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/my-clubs" element={<MyClubs />} />
                        <Route path="/clubs" element={<Clubs />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/account" element={<Account />} />
                        <Route
                            path="/notifications"
                            element={<Notifications />}
                        />
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
