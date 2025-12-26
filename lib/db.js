const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(process.cwd(), 'database.json');

const initialState = {
  users: [],
  sessions: [],
  settings: {
    network_name: 'Wi-Fi Hotspot',
    default_quota_mb: 500
  }
};

class JsonDB {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(initialState, null, 2));
    }
  }

  read() {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  }

  write(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  }

  prepare(query) {
    const self = this;
    return {
      get: (param) => {
        const data = self.read();
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
      run: (...params) => {
        const data = self.read();
        if (query.includes('UPDATE users SET otp = ?, otp_expires_at = ? WHERE id = ?')) {
          const user = data.users.find(u => u.id === params[2]);
          if (user) {
            user.otp = params[0];
            user.otp_expires_at = params[1];
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
        }
        else if (query.includes('UPDATE users SET otp = NULL, otp_expires_at = NULL WHERE id = ?')) {
          const user = data.users.find(u => u.id === params[0]);
          if (user) {
            user.otp = null;
            user.otp_expires_at = null;
          }
        }
        else if (query.includes('INSERT INTO sessions (token, user_id, expires_at)')) {
          data.sessions.push({
            token: params[0],
            user_id: params[1],
            expires_at: params[2]
          });
        }
        else if (query.includes('UPDATE users SET quota_used_mb = quota_used_mb + ? WHERE id = ?')) {
          const user = data.users.find(u => u.id === params[1]);
          if (user) user.quota_used_mb += params[0];
        }
        self.write(data);
        return { changes: 1 };
      },
      all: () => []
    };
  }
}

const db = new JsonDB();
module.exports = db;
