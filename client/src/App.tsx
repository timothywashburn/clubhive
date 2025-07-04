import { useState } from 'react';

export function App() {
    const [serverStatus, setServerStatus] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testConnection = async () => {
        setLoading(true);

        try {
            const response = await fetch('/api/health');

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}: ${response.statusText}`
                );
            }

            const data = await response.json();
            setServerStatus(`Connected: ${data.message}`);
        } catch (error) {
            setServerStatus(
                `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 text-center">
            <h1 className="text-3xl font-bold">clubhive</h1>
            <div className="mt-8">
                <button
                    onClick={testConnection}
                    disabled={loading}
                    className={`px-5 py-2.5 text-white font-medium rounded border-none cursor-pointer ${
                        loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {loading ? 'Testing...' : 'Test Server Connection'}
                </button>
                {serverStatus && (
                    <p
                        className={`mt-4 p-2.5 rounded ${
                            serverStatus.includes('Connected')
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {serverStatus}
                    </p>
                )}
            </div>
        </div>
    );
}

export default App;
