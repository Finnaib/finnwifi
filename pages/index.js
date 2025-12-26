import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('1');
    const [loading, setLoading] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [networkName, setNetworkName] = useState('Wi-Fi Hotspot');
    const router = useRouter();

    const countries = [
        { code: '93', name: '🇦🇫' }, { code: '355', name: '🇦🇱' }, { code: '213', name: '�🇿' }, { code: '376', name: '🇦🇩' },
        { code: '244', name: '🇦🇴' }, { code: '1', name: '🇦🇮' }, { code: '672', name: '🇦🇶' }, { code: '54', name: '🇦🇷' },
        { code: '374', name: '🇦🇲' }, { code: '297', name: '🇦🇼' }, { code: '61', name: '🇦�🇺' }, { code: '43', name: '�🇹' },
        { code: '994', name: '🇦🇿' }, { code: '1', name: '🇧�🇸' }, { code: '973', name: '🇧🇭' }, { code: '880', name: '🇧🇩' },
        { code: '1', name: '🇧🇧' }, { code: '375', name: '🇧🇾' }, { code: '32', name: '🇧🇪' }, { code: '501', name: '🇧🇿' },
        { code: '229', name: '🇧🇯' }, { code: '1', name: '🇧🇲' }, { code: '975', name: '🇧🇹' }, { code: '591', name: '🇧🇴' },
        { code: '387', name: '🇧🇦' }, { code: '267', name: '🇧🇼' }, { code: '55', name: '🇧🇷' }, { code: '246', name: '🇮🇴' },
        { code: '1', name: '🇻🇬' }, { code: '673', name: '🇧🇳' }, { code: '359', name: '🇧🇬' }, { code: '226', name: '🇧🇫' },
        { code: '257', name: '🇧🇮' }, { code: '855', name: '🇰🇭' }, { code: '237', name: '🇨🇲' }, { code: '1', name: '🇨🇦' },
        { code: '238', name: '🇨🇻' }, { code: '1', name: '🇰🇾' }, { code: '236', name: '🇨🇫' }, { code: '235', name: '🇹🇩' },
        { code: '56', name: '🇨🇱' }, { code: '86', name: '🇨🇳' }, { code: '61', name: '🇨🇽' }, { code: '61', name: '🇨🇨' },
        { code: '57', name: '🇨🇴' }, { code: '269', name: '🇰🇲' }, { code: '682', name: '🇨🇰' }, { code: '506', name: '🇨🇷' },
        { code: '385', name: '🇭🇷' }, { code: '53', name: '🇨🇺' }, { code: '599', name: '🇨🇼' }, { code: '357', name: '🇨🇾' },
        { code: '420', name: '🇨🇿' }, { code: '243', name: '🇨🇩' }, { code: '45', name: '🇩🇰' }, { code: '253', name: '🇩🇯' },
        { code: '1', name: '🇩🇲' }, { code: '1', name: '🇩🇴' }, { code: '670', name: '🇹🇱' }, { code: '593', name: '🇪🇨' },
        { code: '20', name: '🇪🇬' }, { code: '503', name: '🇸🇻' }, { code: '240', name: '🇬🇶' }, { code: '291', name: '🇪🇷' },
        { code: '372', name: '🇪🇪' }, { code: '251', name: '🇪🇹' }, { code: '500', name: '🇫🇰' }, { code: '298', name: '🇫🇴' },
        { code: '679', name: '🇫🇯' }, { code: '358', name: '🇫🇮' }, { code: '33', name: '🇫🇷' }, { code: '594', name: '🇬�' },
        { code: '689', name: '🇵🇫' }, { code: '241', name: '🇬🇦' }, { code: '220', name: '🇬🇲' }, { code: '995', name: '🇬🇪' },
        { code: '49', name: '🇩🇪' }, { code: '233', name: '🇬🇭' }, { code: '350', name: '🇬🇮' }, { code: '30', name: '🇬🇷' },
        { code: '299', name: '🇬🇱' }, { code: '1', name: '🇬🇩' }, { code: '590', name: '🇬🇵' }, { code: '1', name: '🇬🇺' },
        { code: '502', name: '🇬🇹' }, { code: '44', name: '🇬🇬' }, { code: '224', name: '🇬🇳' }, { code: '245', name: '🇬🇼' },
        { code: '592', name: '🇬🇾' }, { code: '509', name: '🇭🇹' }, { code: '504', name: '🇭🇳' }, { code: '852', name: '🇭🇰' },
        { code: '36', name: '🇭🇺' }, { code: '354', name: '🇮🇸' }, { code: '91', name: '🇮🇳' }, { code: '62', name: '�🇩' },
        { code: '98', name: '🇮🇷' }, { code: '964', name: '🇮🇶' }, { code: '353', name: '🇮🇪' }, { code: '44', name: '🇮🇲' },
        { code: '972', name: '🇮🇱' }, { code: '39', name: '🇮🇹' }, { code: '225', name: '🇨�' }, { code: '1', name: '🇯🇲' },
        { code: '81', name: '🇯�🇵' }, { code: '44', name: '🇯🇪' }, { code: '962', name: '�🇴' }, { code: '7', name: '🇰🇿' },
        { code: '254', name: '�🇰🇪' }, { code: '686', name: '🇰🇮' }, { code: '383', name: '🇽🇰' }, { code: '965', name: '🇰🇼' },
        { code: '996', name: '🇰🇬' }, { code: '856', name: '🇱🇦' }, { code: '371', name: '🇱🇻' }, { code: '961', name: '🇱🇧' },
        { code: '266', name: '🇱🇸' }, { code: '231', name: '🇱🇷' }, { code: '218', name: '🇱🇾' }, { code: '423', name: '🇱🇮' },
        { code: '370', name: '🇱🇹' }, { code: '352', name: '🇱🇺' }, { code: '853', name: '🇲🇴' }, { code: '389', name: '🇲🇰' },
        { code: '261', name: '🇲🇬' }, { code: '265', name: '🇲🇼' }, { code: '60', name: '��' }, { code: '960', name: '🇲🇻' },
        { code: '223', name: '🇲🇱' }, { code: '356', name: '🇲🇹' }, { code: '692', name: '🇲🇭' }, { code: '596', name: '🇲🇶' },
        { code: '222', name: '🇲🇷' }, { code: '230', name: '🇲�' }, { code: '262', name: '�🇾🇹' }, { code: '52', name: '🇲🇽' },
        { code: '691', name: '🇫🇲' }, { code: '373', name: '�🇩' }, { code: '377', name: '🇲🇨' }, { code: '976', name: '🇲🇳' },
        { code: '382', name: '🇲🇪' }, { code: '1', name: '🇲🇸' }, { code: '212', name: '🇲🇦' }, { code: '258', name: '🇲🇿' },
        { code: '95', name: '🇲🇲' }, { code: '264', name: '🇳🇦' }, { code: '674', name: '🇳🇷' }, { code: '977', name: '🇳�🇵' },
        { code: '31', name: '🇳🇱' }, { code: '687', name: '🇳🇨' }, { code: '64', name: '🇳🇿' }, { code: '505', name: '🇳🇮' },
        { code: '227', name: '🇳🇪' }, { code: '234', name: '🇳🇬' }, { code: '683', name: '🇳🇺' }, { code: '672', name: '🇳�' },
        { code: '850', name: '🇰🇵' }, { code: '1', name: '🇲🇵' }, { code: '47', name: '🇳🇴' }, { code: '968', name: '🇴🇲' },
        { code: '92', name: '🇵🇰' }, { code: '680', name: '🇵🇼' }, { code: '970', name: '🇵🇸' }, { code: '507', name: '��' },
        { code: '675', name: '🇵🇬' }, { code: '595', name: '🇵🇾' }, { code: '51', name: '🇵🇪' }, { code: '63', name: '🇵🇭' },
        { code: '64', name: '🇵🇳' }, { code: '48', name: '🇵🇱' }, { code: '351', name: '🇵🇹' }, { code: '1', name: '🇵🇷' },
        { code: '974', name: '🇶🇦' }, { code: '262', name: '🇷🇪' }, { code: '40', name: '🇷🇴' }, { code: '7', name: '🇷🇺' },
        { code: '250', name: '🇷🇼' }, { code: '590', name: '🇧🇱' }, { code: '290', name: '��🇭' }, { code: '1', name: '🇰🇳' },
        { code: '1', name: '🇲🇸' }, { code: '590', name: '🇲🇫' }, { code: '508', name: '🇵🇲' }, { code: '1', name: '🇻🇨' },
        { code: '685', name: '🇼🇸' }, { code: '378', name: '🇸🇲' }, { code: '239', name: '🇸🇹' }, { code: '966', name: '🇸🇦' },
        { code: '221', name: '🇸🇳' }, { code: '381', name: '🇷🇸' }, { code: '248', name: '🇸🇨' }, { code: '232', name: '🇸🇱' },
        { code: '65', name: '�🇬' }, { code: '1', name: '🇸🇽' }, { code: '421', name: '🇸🇰' }, { code: '386', name: '🇸🇮' },
        { code: '677', name: '🇸🇧' }, { code: '252', name: '🇸🇴' }, { code: '27', name: '🇿🇦' }, { code: '82', name: '🇰🇷' },
        { code: '211', name: '🇸🇸' }, { code: '34', name: '🇪🇸' }, { code: '94', name: '🇱🇰' }, { code: '249', name: '🇸🇩' },
        { code: '597', name: '🇸🇷' }, { code: '268', name: '🇸🇿' }, { code: '46', name: '🇸🇪' }, { code: '41', name: '🇨🇭' },
        { code: '963', name: '🇸🇾' }, { code: '886', name: '🇹🇼' }, { code: '992', name: '🇹🇯' }, { code: '255', name: '🇹🇿' },
        { code: '66', name: '🇹🇭' }, { code: '228', name: '🇹🇬' }, { code: '690', name: '🇹🇰' }, { code: '676', name: '🇹🇴' },
        { code: '1', name: '🇹🇹' }, { code: '216', name: '�🇳' }, { code: '90', name: '🇹🇷' }, { code: '993', name: '🇹🇲' },
        { code: '1', name: '🇹🇨' }, { code: '688', name: '🇹🇻' }, { code: '1', name: '🇻🇮' }, { code: '256', name: '🇺🇬' },
        { code: '380', name: '🇺🇦' }, { code: '971', name: '🇦🇪' }, { code: '44', name: '🇬🇧' }, { code: '1', name: '🇺🇸' },
        { code: '598', name: '🇺🇾' }, { code: '998', name: '🇺�🇿' }, { code: '678', name: '🇻�' }, { code: '39', name: '🇻�🇦' },
        { code: '58', name: '🇻🇪' }, { code: '84', name: '🇻🇳' }, { code: '681', name: '🇼🇫' }, { code: '967', name: '🇾🇪' },
        { code: '260', name: '🇿🇲' }, { code: '263', name: '🇿🇼' }
    ];

    useEffect(() => {
        if (router.isReady) {
            // Capture OpenWrt parameters
            const { gw_address, gw_port, gw_id, mac, ip, url } = router.query;
            if (gw_address) {
                const params = { gw_address, gw_port, gw_id, mac, ip, url };
                sessionStorage.setItem('nds_params', JSON.stringify(params));
            }

            // Fetch network name from settings
            fetch('/api/network/details')
                .then(res => res.json())
                .then(data => {
                    if (data.network_name) setNetworkName(data.network_name);
                })
                .catch(() => { });
        }
    }, [router.isReady, router.query]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!accepted) {
            alert('Please accept the terms to continue.');
            return;
        }

        // Combine code and phone
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < 7) {
            alert('Please enter a valid phone number');
            return;
        }

        const fullNumber = countryCode + cleanPhone;
        setLoading(true);

        try {
            const res = await fetch('/api/auth/request-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: fullNumber }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push(`/verify?phone=${encodeURIComponent(fullNumber)}`);
            } else {
                const errorMsg = data.details ? `Database error: ${data.details}` : (data.error || 'Something went wrong');
                alert(errorMsg);
            }
        } catch (err) {
            alert('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Head>
                <title>{networkName}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;800&display=swap" rel="stylesheet" />
            </Head>

            <div className="card">
                <div style={{ marginBottom: '32px' }}>
                    <div className="logo-box">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                            <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                            <line x1="12" y1="20" x2="12.01" y2="20"></line>
                        </svg>
                    </div>
                    <h1>{networkName}</h1>
                    <p>Enter your <b>Phone Number</b> to receive your access code via SMS.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="phone">Phone Number (SMS)</label>
                        <div className="professional-input">
                            <div className="prefix-container">
                                <select
                                    className="country-select-minimal"
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                >
                                    {countries.map(c => (
                                        <option key={c.code} value={c.code}>
                                            {c.name} +{c.code}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="divider"></div>
                            <input
                                id="phone"
                                type="tel"
                                placeholder="234 567 8900"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="terms-check" onClick={() => setAccepted(!accepted)}>
                        <div className={`checkbox ${accepted ? 'checked' : ''}`}>
                            {accepted && <span>✓</span>}
                        </div>
                        <span>I accept the <b>Terms of Service</b>.</span>
                    </div>

                    <button type="submit" disabled={loading} className="pixel-button">
                        {loading ? 'Sending SMS...' : 'Get Access Code'}
                    </button>

                    <div className="sms-notice">
                        <span style={{ marginRight: '8px' }}>📨</span> Safe and Secure SMS Verification
                    </div>
                </form>

                <div className="footer-text">
                    Secured by OpenWrt Portal
                </div>
            </div>

            <style jsx>{`
                .professional-input {
                    display: flex;
                    align-items: center;
                    background: var(--input-bg);
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    transition: border-color 0.3s, box-shadow 0.3s;
                    overflow: hidden;
                    height: 56px;
                }
                .professional-input:focus-within {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px var(--primary-glow);
                }
                .prefix-container {
                    padding-left: 16px;
                    display: flex;
                    align-items: center;
                }
                .country-select-minimal {
                    background: transparent;
                    border: none;
                    color: white;
                    font-family: 'Outfit', sans-serif;
                    font-weight: 600;
                    outline: none;
                    cursor: pointer;
                    font-size: 1.1rem;
                    padding-right: 20px;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    width: auto;
                    min-width: 50px;
                }
                .prefix-container::after {
                    content: '▼';
                    font-size: 0.5rem;
                    margin-left: -15px;
                    opacity: 0.5;
                    pointer-events: none;
                }
                .country-select-minimal option {
                    background: #1a1a2e;
                    color: white;
                    padding: 10px;
                }
                .divider {
                    width: 1px;
                    height: 24px;
                    background: var(--border);
                    margin: 0 16px;
                }
                .professional-input input {
                    background: transparent;
                    border: none;
                    flex: 1;
                    height: 100%;
                    padding: 0;
                    font-size: 1.1rem;
                    letter-spacing: 0.5px;
                }
                .professional-input input:focus {
                    box-shadow: none;
                }
                .logo-box {
                    width: 64px;
                    height: 64px;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    border-radius: 20px;
                    margin: 0 auto 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    box-shadow: 0 8px 30px var(--primary-glow);
                    animation: float 3s ease-in-out infinite;
                }
                .terms-check {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                    text-align: left;
                    padding: 12px;
                    cursor: pointer;
                    user-select: none;
                }
                .checkbox {
                    width: 22px;
                    height: 22px;
                    border-radius: 6px;
                    border: 2px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    flex-shrink: 0;
                    font-size: 14px;
                }
                .checkbox.checked {
                    background: var(--primary);
                    border-color: var(--primary);
                    color: white;
                }
                .sms-notice {
                    margin-top: 24px;
                    font-size: 0.85rem;
                    color: var(--text-dim);
                    text-align: center;
                    opacity: 0.8;
                }
                .footer-text {
                    margin-top: 40px;
                    opacity: 0.4;
                    font-size: 0.75rem;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </div>
    );
}
