import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Verify() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [authUrl, setAuthUrl] = useState('');
    const [demoOtp, setDemoOtp] = useState('');
    const router = useRouter();
    const { phone, otp: queryOtp } = router.query;

    useEffect(() => {
        if (router.isReady && !phone) {
            router.push('/');
        }
    }, [router.isReady, phone]);

    useEffect(() => {
        if (queryOtp) setDemoOtp(queryOtp);
    }, [queryOtp]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp }),
            });

            const data = await res.json();

            if (res.ok) {
                const ndsParamsRaw = sessionStorage.getItem('nds_params');
                if (ndsParamsRaw) {
                    const params = JSON.parse(ndsParamsRaw);
                    const { gw_address, gw_port, url } = params;
                    const targetUrl = url || 'http://www.google.com';
                    const finalAuthUrl = `http://${gw_address}:${gw_port}/opennds_auth/?token=${data.token}&url=${encodeURIComponent(targetUrl)}`;

                    setAuthUrl(finalAuthUrl);
                    setSuccess(true);
                } else {
                    localStorage.setItem('wifi_token', data.token);
                    router.push('/status');
                }
            } else {
                alert(data.error || 'Invalid code');
            }
        } catch (err) {
            alert('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-container">
                <div className="card" style={{ textAlign: 'center' }}>
                    <div className="success-icon">✅</div>
                    <h1>Identity Verified</h1>
                    <p>You are now ready to access the high-speed network.</p>

                    <a href={authUrl} className="primary-button" style={{ display: 'block', textDecoration: 'none', marginTop: '32px' }}>
                        Connect to Wi-Fi Now
                    </a>

                    <div className="troubleshoot">
                        <p>Got a "Refused to connect" error?</p>
                        <span>Make sure you are connected to the router's Wi-Fi network before clicking the button above.</span>
                    </div>
                </div>
                <style jsx>{`
                    .success-icon { font-size: 64px; margin-bottom: 24px; animation: scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                    .primary-button {
                        background: linear-gradient(135deg, var(--primary), var(--secondary));
                        color: white;
                        padding: 18px;
                        border-radius: 16px;
                        font-weight: 700;
                        box-shadow: 0 8px 30px var(--primary-glow);
                        transition: transform 0.2s;
                    }
                    .primary-button:hover { transform: translateY(-2px); }
                    .troubleshoot { margin-top: 40px; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid var(--border); font-size: 0.85rem; opacity: 0.8; }
                    .troubleshoot p { color: var(--primary); font-weight: 600; margin-bottom: 8px; }
                    @keyframes scaleUp { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <Head>
                <title>Verify SMS</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;800&display=swap" rel="stylesheet" />
            </Head>

            <div className="card">
                <div style={{ marginBottom: '32px' }}>
                    <h1>Verify Identity</h1>
                    <p>Enter the 6-digit code sent to<br /><b style={{ color: '#fff' }}>+{phone}</b></p>
                </div>

                {demoOtp && (
                    <div className="demo-box" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                        <div className="demo-label">📨 SMS TEST CODE</div>
                        <div className="demo-code">{demoOtp}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="otp">One-Time Password</label>
                        <input
                            id="otp"
                            type="text"
                            placeholder="······"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            required
                            style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '24px' }}
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Verifying...' : 'Establish Connection'}
                    </button>

                    <div style={{ marginTop: '24px' }}>
                        <a onClick={() => router.back()} style={{ cursor: 'pointer', opacity: 0.7, fontSize: '0.9rem' }}>
                            Change phone number
                        </a>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .demo-box {
                    background: rgba(139, 92, 246, 0.1);
                    border: 1px solid var(--primary);
                    borderRadius: 16px;
                    padding: 16px;
                    marginBottom: 32px;
                    textAlign: left;
                    animation: slideDown 0.5s ease-out;
                }
                .demo-label { fontWeight: bold; color: var(--primary); marginBottom: 4px; fontSize: 0.85rem; }
                .demo-code { fontSize: 1.5rem; fontWeight: 800; letterSpacing: 8px; color: #fff; }
                @keyframes slideDown {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
