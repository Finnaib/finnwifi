import db from '../../../lib/db';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    try {
        const user = await db.prepare('SELECT id, otp, otp_expires_at, quota_limit_mb, quota_used_mb FROM users WHERE phone = ?').get(phone);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.quota_used_mb >= user.quota_limit_mb) {
            return res.status(403).json({ error: 'DATA_LIMIT_REACHED', message: 'You have reached your data limit.' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }

        if (new Date(user.otp_expires_at) < new Date()) {
            return res.status(400).json({ error: 'Code has expired' });
        }

        // Clear OTP and create session
        const token = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days session

        await db.prepare('UPDATE users SET otp = NULL, otp_expires_at = NULL WHERE id = ?').run(user.id);
        await db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)')
            .run(token, user.id, expiresAt.toISOString());

        return res.status(200).json({ token });
    } catch (err) {
        console.error('Verify OTP Error:', err);
        return res.status(500).json({
            error: 'Verification error',
            details: err.message
        });
    }
}
