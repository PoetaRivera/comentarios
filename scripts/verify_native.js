const http = require('http');

console.log('--- Testing POST with native http ---');

const postData = JSON.stringify({
    author: 'Native Tester',
    content: 'Testing with http module',
    metadata: { source: 'native-script' }
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/comments/test-native-app',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('BODY:', data);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
