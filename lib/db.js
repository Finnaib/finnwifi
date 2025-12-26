const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(process.cwd(), 'database.json');

const initialState = {
  users: [],
  sessions: [],
  settings: {
    admin_password: "admin123",
    default_quota_mb: "500"
  },
  networks: [
    {
      id: 1,
      name: "Wi-Fi Hotspot",
      default_quota_mb: 50
    }
  ]
};

// HELPER: Detect if we should use Cloud Storage (Vercel KV)
const isCloud = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

class DatabaseInterface {
  constructor() {
    if (isCloud) {
      console.log('[DB] Using Cloud Storage (Vercel KV)');
    } else {
      console.log('[DB] Using Local Storage (database.json)');
      this.initLocal();
    }
  }

  initLocal() {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(initialState, null, 2));
    }
  }

  async read() {
    if (isCloud) {
      try {
        const res = await fetch(`${process.env.KV_REST_API_URL}/get/wifi_db`, {
          headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
        });
        const data = await res.json();
        return data.result ? JSON.parse(data.result) : initialState;
      } catch (err) {
        console.error('[DB_CLOUD_READ_ERROR]', err);
        return initialState;
      }
    } else {
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    }
  }

  async write(data) {
    if (isCloud) {
      try {
        await fetch(`${process.env.KV_REST_API_URL}/set/wifi_db`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
          body: JSON.stringify(data)
        });
      } catch (err) {
        console.error('[DB_CLOUD_WRITE_ERROR]', err);
      }
    } else {
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    }
  }

  prepare(query) {
    const self = this;
    return {
      get: async (...params) => {
        const data = await self.read();
        const param = params[0]; // First param is usually the primary key/filter
        if (query.includes('FROM users WHERE phone = ?')) {
          return data.users.find(u => u.phone === param);
        }
        if (query.includes('FROM settings')) {
          return data.settings;
        }
        if (query.includes('FROM sessions WHERE token = ?')) {
          const session = data.sessions.find(s => s.token === param);
          if (session && new Date(session.expires_at) > new Date()) return session;
          return null;
        }
        if (query.includes('FROM users WHERE id = ?')) {
          return data.users.find(u => u.id === param);
        }
        return null;
      },
      run: async (...params) => {
        const data = await self.read();
        let changed = false;
        if (query.includes('UPDATE users SET otp = ?, otp_expires_at = ? WHERE id = ?')) {
          const user = data.users.find(u => u.id === params[2]);
          if (user) {
            user.otp = params[0];
            user.otp_expires_at = params[1];
            changed = true;
          }
        }
        else if (query.includes('INSERT INTO users (phone, otp, otp_expires_at, quota_limit_mb)')) {
          data.users.push({
            id: Date.now(),
            phone: params[0],
            otp: params[1],
            otp_expires_at: params[2],
            quota_limit_mb: params[3],
            quota_used_mb: 0,
            created_at: new Date().toISOString()
          });
          changed = true;
        }
        else if (query.includes('UPDATE users SET otp = NULL, otp_expires_at = NULL WHERE id = ?')) {
          const user = data.users.find(u => u.id === params[0]);
          if (user) {
            user.otp = null;
            user.otp_expires_at = null;
            changed = true;
          }
        }
        else if (query.includes('INSERT INTO sessions (token, user_id, expires_at)')) {
          data.sessions.push({
            token: params[0],
            user_id: params[1],
            expires_at: params[2]
          });
          changed = true;
        }
        else if (query.includes('UPDATE users SET quota_used_mb = quota_used_mb + ? WHERE id = ?')) {
          const user = data.users.find(u => u.id === params[1]);
          if (user) {
            user.quota_used_mb += params[0];
            changed = true;
          }
        }
        if (changed) await self.write(data);
        return { changes: 1 };
      },
      all: async () => []
    };
  }
}

const db = new DatabaseInterface();
module.exports = db;
