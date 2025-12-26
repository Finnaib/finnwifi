# OpenWrt Configuration Guide (opennds)

Follow these steps to configure your OpenWrt router to use this captive portal.

## 1. Install opennds
Connect to your router via SSH and run:
```bash
opkg update
opkg install opennds
```

## 2. Configure opennds
Edit the configuration file:
```bash
vi /etc/config/opennds
```

Set the following options (replace `your-portal-url.com` with your hosted portal URL):

```bash
config opennds
    option enabled '1'
    option gatewayinterface 'br-lan'
    option gatewayname 'OpenWrt Hotspot'
    
    # Forwarding Authentication Service (FAS)
    option fasport '80'
    option faspath '/api/auth/opennds-redirect' # Optional: handled by index.js query params
    option fasremoteip 'YOUR_SERVER_IP'
    
    # Critical: Point to your Next.js portal
    option fashost 'your-portal-url.com'
    option fasport '443'
    option fasssl '1' 
    
    # FAS Level 1: Simple redirect with parameters
    option faslevel '1'
```

## 3. Restart Service
```bash
/etc/init.d/opennds restart
```

## 4. How it works
1. Client connects to Wi-Fi.
2. `opennds` redirects client to: `https://your-portal-url.com/?gw_address=...&gw_port=...&mac=...`
3. Client enters email and OTP.
4. Portal redirects client back to router's gateway to grant access.
