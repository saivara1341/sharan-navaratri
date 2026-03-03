const https = require('https');

const options = {
    hostname: '172.64.149.246',
    port: 443,
    path: '/rest/v1/',
    method: 'GET',
    headers: {
        'Host': 'xgrdubcpomwzbuaqtjad.supabase.co',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhncmR1YmNwb213emJ1YXF0amFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NjY3MzksImV4cCI6MjA4NTQ0MjczOX0.O52EhG_2iOjl4Ba2yknPcnqswAk8GIVrAQceEe0ImzI'
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
