const db = require('../../../lib/db');

export default async function handler(req, res) {
    try {
        const settings = await db.prepare('SELECT * FROM settings').get();
        res.status(200).json(settings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch network details' });
    }
}
