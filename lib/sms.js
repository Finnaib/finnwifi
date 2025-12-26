const https = require('https');

// TWILIO CONFIGURATION
const TWILIO_CONFIG = {
    accountSid: process.env.TWILIO_ACCOUNT_SID || 'AC_PLACEHOLDER',
    authToken: process.env.TWILIO_AUTH_TOKEN || 'AUTH_TOKEN_PLACEHOLDER',
    fromNumber: process.env.TWILIO_FROM_NUMBER || '+10000000000'
};

async function sendSms(to, otp) {
    console.log(`\n[SMS_SYSTEM] Attempting to send code ${otp} to ${to}`);

    if (TWILIO_CONFIG.accountSid.startsWith('AC_') || TWILIO_CONFIG.authToken.startsWith('YOUR_')) {
        console.log(`[SMS_MOCK] Twilio not fully configured. Logging code: ${otp}`);
        return { success: true, mock: true };
    }

    const auth = Buffer.from(`${TWILIO_CONFIG.accountSid}:${TWILIO_CONFIG.authToken}`).toString('base64');
    const data = new URLSearchParams({
        Body: `Your Wi-Fi access code is: ${otp}`,
        From: TWILIO_CONFIG.fromNumber,
        To: to.startsWith('+') ? to : `+${to}`
    }).toString();

    const options = {
        hostname: 'api.twilio.com',
        port: 443,
        path: `/2010-04-01/Accounts/${TWILIO_CONFIG.accountSid}/Messages.json`,
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        console.log(`[SMS_SUCCESS] Message SID: ${response.sid}`);
                        resolve({ success: true, sid: response.sid });
                    } else {
                        console.error(`[SMS_ERROR] Twilio Error: ${response.message || 'Unknown error'}`);
                        resolve({ success: false, error: response.message || 'Unknown Twilio error' });
                    }
                } catch (e) {
                    console.error(`[SMS_PARSE_ERROR] Failed to parse Twilio response: ${body}`);
                    reject(new Error('Failed to parse response from SMS provider'));
                }
            });
        });

        req.on('error', (error) => {
            console.error(`[SMS_HTTP_ERROR] ${error.message}`);
            resolve({ success: false, error: error.message });
        });

        req.write(data);
        req.end();
    });
}

module.exports = { sendSms, TWILIO_CONFIG };
