import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Status() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [networkName, setNetworkName] = useState('My Network');
    const router = useRouter();

    const fetchStatus = async () => {
        const token = localStorage.getItem('wifi_token');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const res = await fetch('/api/user/status', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 403) {
                router.push('/limit-reached');
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setUser(data);

                // Fetch network name
                const nRes = await fetch('/api/network/details');
                if (nRes.ok) {
                    const nData = await nRes.json();
                    setNetworkName(nData.name);
                }
            } else {
                localStorage.removeItem('wifi_token');
                router.push('/');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="auth-container">
            <h1 style={{ animation: 'pulse 1.5s infinite' }}>Establishing Link...</h1>
        </div>
    );

    const usagePercent = Math.min((user.quota_used_mb / user.quota_limit_mb) * 100, 100);

    return (
        <div className="auth-container">
            <Head>
                <title>Status | {networkName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;800&display=swap" rel="stylesheet" />
            </Head>

            <div className="card" style={{ maxWidth: '500px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Connected to</span>
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{networkName}</h2>
                    </div>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: 'var(--success)',
                        boxShadow: '0 0 10px var(--success)'
                    }}></div>
                </div>

                <div style={{
                    position: 'relative',
                    width: '200px',
                    height: '200px',
                    margin: '0 auto 40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <svg style={{ transform: 'rotate(-90deg)', width: '200px', height: '200px' }}>
                        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                        <circle cx="100" cy="100" r="90" fill="none" stroke="url(#neonGradient)" strokeWidth="12"
                            strokeDasharray="565.48" strokeDashoffset={565.48 - (565.48 * usagePercent / 100)}
                            style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                        <defs>
                            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="var(--primary)" />
                                <stop offset="100%" stopColor="var(--secondary)" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div style={{ position: 'absolute', textAlign: 'center' }}>
                        <div className="stat">
                            <label>Registered Phone</label>
                            <div className="value">+{user?.phone}</div>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>{user.quota_used_mb}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>MB USED</div>
                    </div>
                </div>

                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '20px',
                    padding: '20px',
                    marginBottom: '32px',
                    border: '1px solid var(--border)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px'
                }}>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginBottom: '4px' }}>Session Limit</div>
                        <div style={{ fontWeight: '600' }}>{user.quota_limit_mb} MB</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginBottom: '4px' }}>Remaining</div>
                        <div style={{ fontWeight: '600', color: usagePercent > 90 ? 'var(--error)' : 'var(--text)' }}>
                            {Math.max(user.quota_limit_mb - user.quota_used_mb, 0)} MB
                        </div>
                    </div>
                </div>

                <button onClick={() => { localStorage.removeItem('wifi_token'); router.push('/'); }}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: 'var(--text-dim)',
                        boxShadow: 'none'
                    }}
                    onMouseOver={(e) => { e.target.style.borderColor = 'var(--error)'; e.target.style.color = 'var(--error)'; }}
                    onMouseOut={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-dim)'; }}>
                    Disconnect Session
                </button>
            </div>
        </div>
    );
}
