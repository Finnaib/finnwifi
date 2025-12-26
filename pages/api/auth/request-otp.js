import db from '../../../lib/db';
import { sendSms } from '../../../lib/sms';

export default async function handler(res, res_orig) {
    if (res.method !== 'POST') return res_orig.status(405).end();

    const { phone } = res.body;
    if (!phone) return res_orig.status(400).json({ error: 'Phone number is required' });

    try {
        const settings = db.prepare('SELECT * FROM settings').get();
        const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);

        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        if (user) {
            db.prepare('UPDATE users SET otp = ?, otp_expires_at = ? WHERE id = ?')
                .run(otp, expiresAt.toISOString(), user.id);
        } else {
            db.prepare('INSERT INTO users (phone, otp, otp_expires_at, quota_limit_mb) VALUES (?, ?, ?, ?)')
                .run(phone, otp, expiresAt.toISOString(), settings.default_quota_mb);
        }

        // Send via SMS
        const result = await sendSms(phone, otp);

        console.log(`\n-----------------------------------------`);
        console.log(`[SMS_TEST_CODE] Code for ${phone}: ${otp}`);
        console.log(`-----------------------------------------\n`);

        return res_orig.status(200).json({ message: 'Code sent to your phone via SMS' });

    } catch (err) {
        console.error(err);
        return res_orig.status(500).json({ error: 'Database error' });
    }
}
