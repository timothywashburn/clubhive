import { EventType } from '@clubhive/shared';

const BASE_URL = 'http://localhost:3000';

async function makeRequest(url: string, options: RequestInit = {}) {
    const response = await fetch(url, options);
    const data = await response.json();
    return { data, status: response.status, ok: response.ok };
}

async function testEventsAPI() {
    console.log('🧪 Testing Events API...\n');

    let createdEventId: string;

    try {
        // Test 1: Create Event
        console.log('1. Testing CREATE event...');
        const createResponse = await makeRequest(`${BASE_URL}/api/events`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer dummy-token',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                club: '507f1f77bcf86cd799439022',
                name: 'Test Event',
                description: 'This is a test event',
                requirements: 'None',
                type: EventType.ANYONE,
                location: 'Test Location',
                date: '2025-08-01',
                startTime: '14:00',
                endTime: '16:00',
                picture: '507f1f77bcf86cd799439012',
                tags: ['507f1f77bcf86cd799439013', '507f1f77bcf86cd799439014'],
            }),
        });

        if (createResponse.data.success) {
            createdEventId = createResponse.data.data.event._id;
            console.log('✅ CREATE event successful:', createdEventId);
        } else {
            console.log('❌ CREATE event failed:', createResponse.data.error);
        }

        // Test 2: Get All Events
        console.log('\n2. Testing GET all events...');
        const getResponse = await makeRequest(`${BASE_URL}/api/events`, {
            headers: {
                Authorization: 'Bearer dummy-token',
            },
        });

        if (getResponse.data.success) {
            console.log('✅ GET events successful. Found', getResponse.data.data.events.length, 'events');
        } else {
            console.log('❌ GET events failed:', getResponse.data.error);
        }

        // Test 3: Update Event
        if (createdEventId) {
            console.log('\n3. Testing UPDATE event...');
            const updateResponse = await makeRequest(`${BASE_URL}/api/events/${createdEventId}`, {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer dummy-token',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'Updated Test Event',
                    description: 'This event has been updated',
                }),
            });

            if (updateResponse.data.success) {
                console.log('✅ UPDATE event successful');
            } else {
                console.log('❌ UPDATE event failed:', updateResponse.data.error);
            }
        }

        // Test 4: Delete Event
        if (createdEventId) {
            console.log('\n4. Testing DELETE event...');
            const deleteResponse = await makeRequest(`${BASE_URL}/api/events/${createdEventId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer dummy-token',
                },
            });

            if (deleteResponse.data.success) {
                console.log('✅ DELETE event successful');
            } else {
                console.log('❌ DELETE event failed:', deleteResponse.data.error);
            }
        }

        // Test 5: Validation Tests
        console.log('\n5. Testing validation...');

        // Test invalid data
        const validationResponse = await makeRequest(`${BASE_URL}/api/events`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer dummy-token',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Missing required fields
                name: 'Invalid Event',
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

    console.log('\n🎉 API tests completed!');
}

// Run the tests
testEventsAPI().catch(console.error);
