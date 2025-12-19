const http = require('http');

console.log('--- Testing GET with native http ---');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/comments/test-native-app',
    method: 'GET'
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

req.end();
