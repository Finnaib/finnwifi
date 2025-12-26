const db = require('../../../lib/db');

export default async function handler(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.split(' ')[1];

    try {
        const session = await db.prepare('SELECT user_id FROM sessions WHERE token = ? AND expires_at > ?')
            .get(token, new Date().toISOString());

        if (!session) return res.status(401).json({ error: 'Invalid or expired session' });

        // Mock: Increment usage by 1-5MB on every status check to simulate activity
        const randomUsage = Math.floor(Math.random() * 5) + 1;
        await db.prepare('UPDATE users SET quota_used_mb = quota_used_mb + ? WHERE id = ?')
            .run(randomUsage, session.user_id);
        const user = await db.prepare('SELECT id, phone, quota_limit_mb, quota_used_mb FROM users WHERE id = ?').get(session.user_id);

        if (!user) return res.status(404).json({ error: 'User not found' });

        // Simulate real-time usage increase in demo
        const newUsage = Math.min(user.quota_limit_mb, user.quota_used_mb + 0.1);

        return res.status(200).json({
            phone: user.phone,
            quota_limit_mb: user.quota_limit_mb,
            quota_used_mb: newUsage
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
