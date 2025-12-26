# 🏁 Start Here: Zero to One Guide

This guide will take you from having **nothing** to a fully working Wi-Fi Captive Portal for your OpenWrt router.

## Step 1: Prepare Your Machine
You need to have **Node.js** installed on your computer.
1. Download from [nodejs.org](https://nodejs.org/) (Choose the **LTS** version).
2. Open your terminal (PowerShell or Command Prompt).
3. Type `node -v` to make sure it's installed.

## Step 2: Set Up the Code
Since I've already prepared the code in this folder (`c:\Users\Finnaib\Desktop\wifi`):
1. Open your terminal.
2. Go into the project folder.
3. Run this command to install the "engine" (dependencies):
   ```bash
   npm install
   ```

## Step 3: Run the Portal Locally
Run this command to start the portal on your computer:
```bash
npm run dev
```
Now, open your browser and go to: `http://localhost:3000`
You should see the login screen!

## Step 4: Test with "Fake" OpenWrt
To see how it will look when someone connects through your router, go to this URL:
`http://localhost:3000/?gw_address=192.168.1.1&gw_port=2050&url=http://google.com`

---

## Step 5: Put it on the Internet (Deployment)
For OpenWrt to find your portal, it needs to be on the internet.
1. Create a free account on [Vercel](https://vercel.com/).
2. Connect your GitHub repository or use the Vercel CLI to upload this folder.
3. Once deployed, Vercel will give you a link like `https://my-wifi-portal.vercel.app`.

---

## Step 6: Connect Your OpenWrt Router
Now that your portal is live on the internet:
1. SSH into your router.
2. Follow the steps in [OPENWRT_GUIDE.md](file:///c:/Users/Finnaib/Desktop/wifi/OPENWRT_GUIDE.md).
3. Set the `fashost` to your Vercel link.

---

## Need Help?
If you're stuck on **Step 1** or **Step 5**, just ask me! I can explain how to set up GitHub or Vercel in more detail.
