const BASE_URL = 'http://localhost:3000';

async function makeRequest(url: string, options: RequestInit = {}) {
    const response = await fetch(url, options);
    const data = await response.json();
    return { data, status: response.status, ok: response.ok };
}

async function testMeAPI() {
    console.log('🧪 Testing Me API...\n');

    try {
        // Test GET /api/me/clubs
        console.log('Testing GET /api/me/clubs...');
        const response = await makeRequest(`${BASE_URL}/api/me/clubs`, {
            headers: {
                Authorization: 'Bearer dummy-token',
            },
        });

        if (response.data.success) {
            console.log('✅ Success! Found', response.data.data.clubs.length, 'clubs for user');
        } else {
            console.log('❌ Failed:', response.data.error);
        }
    } catch (error: any) {
        console.log('❌ Error:', error.message);
    }
}

testMeAPI().catch(console.error);
