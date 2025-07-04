import { useState } from 'react';
import './App.css';

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
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>ClubHive</h1>
            <div style={{ marginTop: '2rem' }}>
                <button
                    onClick={testConnection}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: loading ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Testing...' : 'Test Server Connection'}
                </button>
                {serverStatus && (
                    <p
                        style={{
                            marginTop: '1rem',
                            padding: '10px',
                            backgroundColor: serverStatus.includes('Connected')
                                ? '#d4edda'
                                : '#f8d7da',
                            color: serverStatus.includes('Connected')
                                ? '#155724'
                                : '#721c24',
                            borderRadius: '4px',
                        }}
                    >
                        {serverStatus}
                    </p>
                )}
            </div>
        </div>
    );
}

export default App;
