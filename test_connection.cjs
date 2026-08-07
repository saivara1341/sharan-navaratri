const https = require('https');

const options = {
    hostname: '172.64.149.246',
    port: 443,
    path: '/rest/v1/',
    method: 'GET',
    headers: {
        'Host': 'xoqpxckowwubeqdtazks.supabase.co',
        'apikey': 'sb_publishable_Db5k1uOh50NIY-GPvMm0HQ_OMnOz8D7'
    },
    rejectUnauthorized: false // Needed when hitting IP with direct hostname header
};

console.log('Testing Supabase connectivity via direct IP...');
const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (e) => {
    console.error(`ERROR: ${e.message}`);
});

req.end();
