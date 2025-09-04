import { Link } from 'react-router';

export function NotFound() {
    return (
        <div className="h-full relative">
            <div className="flex items-center justify-center h-full">
                <div className="max-w-md text-center">
                    <h1 className="text-6xl font-bold text-on-surface mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-on-surface mb-4">Page Not Found</h2>
                    <p className="text-on-surface-variant mb-8">The page you're looking for doesn't exist or has been moved.</p>
                    <Link to="/" className="bg-primary text-on-primary px-6 py-3 rounded-md hover:bg-primary/90 font-medium inline-block">
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
