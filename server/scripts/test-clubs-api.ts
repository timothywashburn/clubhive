const BASE_URL = 'http://localhost:3000';

async function makeRequest(url: string, options: RequestInit = {}) {
    const response = await fetch(url, options);
    const data = await response.json();
    return { data, status: response.status, ok: response.ok };
}

async function testClubsAPI() {
    console.log('🧪 Testing Clubs API...\n');

    let createdClubId: string;

    try {
        // Test 1: Create Club
        console.log('1. Testing CREATE club...');
        const createResponse = await makeRequest(`${BASE_URL}/api/clubs`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer dummy-token',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                school: '507f1f77bcf86cd799439021',
                name: 'Test Club',
                tagline: 'A test club for testing purposes',
                description: 'This is a test club created by the API tester',
                url: 'https://testclub.example.com',
                socials: {
                    website: 'https://testclub.com',
                    discord: 'https://discord.gg/testclub',
                    instagram: '@testclub',
                },
                clubLogo: '507f1f77bcf86cd799439012',
                pictures: ['507f1f77bcf86cd799439013'],
                tags: ['507f1f77bcf86cd799439014', '507f1f77bcf86cd799439015'],
            }),
        });

        if (createResponse.data.success) {
            createdClubId = createResponse.data.data.club._id;
            console.log('✅ CREATE club successful:', createdClubId);
        } else {
            console.log('❌ CREATE club failed:', createResponse.data.error);
        }

        // Test 2: Get All Clubs
        console.log('\n2. Testing GET all clubs...');
        const getResponse = await makeRequest(`${BASE_URL}/api/clubs`, {
            headers: {
                Authorization: 'Bearer dummy-token',
            },
        });

        if (getResponse.data.success) {
            console.log('✅ GET clubs successful. Found', getResponse.data.data.clubs.length, 'clubs');
        } else {
            console.log('❌ GET clubs failed:', getResponse.data.error);
        }

        // Test 3: Update Club
        if (createdClubId) {
            console.log('\n3. Testing UPDATE club...');
            const updateResponse = await makeRequest(`${BASE_URL}/api/clubs/${createdClubId}`, {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer dummy-token',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'Updated Test Club',
                    tagline: 'An updated test club',
                    description: 'This club has been updated',
                }),
            });

            if (updateResponse.data.success) {
                console.log('✅ UPDATE club successful');
            } else {
                console.log('❌ UPDATE club failed:', updateResponse.data.error);
            }
        }

        // Test 4: Delete Club
        if (createdClubId) {
            console.log('\n4. Testing DELETE club...');
            const deleteResponse = await makeRequest(`${BASE_URL}/api/clubs/${createdClubId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer dummy-token',
                },
            });

            if (deleteResponse.data.success) {
                console.log('✅ DELETE club successful');
            } else {
                console.log('❌ DELETE club failed:', deleteResponse.data.error);
            }
        }

        // Test 5: Validation Tests
        console.log('\n5. Testing validation...');

        // Test invalid data
        const validationResponse = await makeRequest(`${BASE_URL}/api/clubs`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer dummy-token',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Missing required fields
                name: 'Invalid Club',
            }),
        });

        if (validationResponse.status === 400) {
            console.log('✅ Validation working - rejected invalid data');
        } else {
            console.log('❌ Validation test failed:', validationResponse.data);
        }
    } catch (error: any) {
        console.log('❌ Test failed with error:', error.message);
    }

    console.log('\n🎉 Clubs API tests completed!');
}

// Run the tests
testClubsAPI().catch(console.error);
