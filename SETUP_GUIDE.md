# PCMAC pro Repair Form - Backend Setup Guide

## Overview
This setup enables your repair form to:
- ✅ Capture form submissions from users
- ✅ Send emails to your repair shop email address
- ✅ Send confirmation emails to customers
- ✅ Easily change the email address without modifying code

## Files Created

1. **server.js** - Node.js/Express backend server
2. **config.js** - Configuration file (change email here!)
3. **package.json** - Dependencies
4. **.env.example** - Environment variables template
5. **script.js** - Updated to send data to backend

## Quick Start

### Step 1: Install Node.js
Download and install from https://nodejs.org/ (LTS version recommended)

### Step 2: Install Dependencies
Open PowerShell in the project folder and run:
```powershell
npm install
```

### Step 3: Change the Email Address
Open `config.js` and update this line:
```javascript
REPAIR_EMAIL: "repairs@fixhub.com.ng",  // Change this to your email
SENDER_EMAIL: "noreply@fixhub.com.ng",   // Change this to your email service
```

### Step 4: Setup Gmail (if using Gmail)
1. Go to https://myaccount.google.com/apppasswords
2. Create an app-specific password
3. Create a `.env` file in your project folder (copy from `.env.example`)
4. Add your app password:
   ```
   EMAIL_PASSWORD=your_16_character_password_here
   ```

### Step 5: Run the Server
```powershell
npm start
```

You should see:
```
FixHub Repair Form Server running on http://localhost:3000
Repair requests will be sent to: repairs@fixhub.com.ng
```

### Step 6: Test the Form
1. Open `http://localhost:3000` in your browser
2. Fill out and submit the repair form
3. Check that the email arrives at your configured email address

## How to Change the Email

To change where repair requests are sent:

1. Open `config.js`
2. Change the `REPAIR_EMAIL` value:
   ```javascript
   REPAIR_EMAIL: "your_new_email@example.com",
   ```
3. Restart the server (Ctrl+C to stop, then `npm start`)

## Email Provider Configuration

### For Gmail:
```javascript
EMAIL_SERVICE: "gmail",
SENDER_EMAIL: "your-email@gmail.com",
```
- Get app password from: https://myaccount.google.com/apppasswords

### For Outlook/Hotmail:
```javascript
EMAIL_SERVICE: "outlook",
SENDER_EMAIL: "your-email@outlook.com",
```

### For Custom Domain Email:
```javascript
EMAIL_SERVICE: "gmail", // or use custom SMTP
SENDER_EMAIL: "support@yourdomain.com",
```

## Environment Variables

The email password is stored in a `.env` file for security. Create it by:

1. Copying `.env.example` to `.env`
2. Adding your email app password:
   ```
   EMAIL_PASSWORD=your_app_password
   ```

⚠️ **Never commit the `.env` file to version control!**

## Troubleshooting

### "Cannot find module 'express'"
- Run: `npm install`

### "Email failed to send"
- Check EMAIL_PASSWORD in .env file
- Verify email address is correct in config.js
- Ensure Gmail app password is set (not your regular password)

### "CORS error" or "Cannot reach server"
- Make sure server is running (`npm start`)
- Check http://localhost:3000/health returns status

### Form submits but email not received
- Check server console for error messages
- Verify sender email and password are correct
- Check spam/junk folder

## Production Deployment

When deploying to production:

1. Update ALLOWED_ORIGINS in config.js with your domain:
   ```javascript
   ALLOWED_ORIGINS: [
     "https://yourdomain.com",
     "https://www.yourdomain.com"
   ]
   ```

2. Set environment variables on your hosting platform
3. Use a production-grade email service or SMTP

## Support

For issues with Nodemailer email configuration, see:
https://nodemailer.com/smtp/

For Express server issues:
https://expressjs.com/
