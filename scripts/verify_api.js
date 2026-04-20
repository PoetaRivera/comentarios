async function testApi() {
    const fetch = (await import('node-fetch')).default || require('node-fetch'); // handle esm/commonjs if needed or just use built-in fetch in newer nodes

    const BASE_URL = 'http://localhost:3000/api/comments';
    const APP_ID = 'test-app-123';

    console.log('--- Testing POST Comment ---');
    try {
        const postRes = await fetch(`${BASE_URL}/${APP_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                author: 'Tester',
                content: 'This is a test comment',
                metadata: { page: 'home' }
            })
        });
        const postData = await postRes.json();
        console.log('Status:', postRes.status);
        console.log('Response:', postData);
    } catch (e) { console.error('POST Error:', e); }

    console.log('\n--- Testing GET Comments ---');
    try {
        const getRes = await fetch(`${BASE_URL}/${APP_ID}`);
        const getData = await getRes.json();
        console.log('Status:', getRes.status);
        console.log('Response:', getData);
    } catch (e) { console.error('GET Error:', e); }
}

// Check if node version has fetch (v18+)
if (!global.fetch) {
    console.log('Warning: This node version might not have global fetch. Please run with Node 18+ or install node-fetch.');
}

testApi();
