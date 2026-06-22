const https = require('https');

const data = JSON.stringify({
    service_id: 'service_g4tj7ba',
    template_id: '__ejs-test-mail-service__',
    user_id: '77fXb6dUemogPZnkY',
    template_params: {
        'name': 'Antigravity AI',
        'email': 'ai-test@pmtech.com',
        'phone': '9999999999',
        'message': 'Verification test for PMTech Website EmailJS integration.'
    }
});

const options = {
    hostname: 'api.emailjs.com',
    port: 443,
    path: '/api/v1.0/email/send',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    let responseBody = '';
    res.on('data', (d) => {
        responseBody += d;
    });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', responseBody);
        if (res.statusCode === 200) {
            console.log('SUCCESS: Email sent successfully via EmailJS REST API!');
        } else {
            console.log('FAILED: Error during email transmission.');
        }
    });
});

req.on('error', (error) => {
    console.error('Network Error:', error);
});

req.write(data);
req.end();
