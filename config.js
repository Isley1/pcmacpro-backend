// Configuration file for PCMAC pro repair form
// Edit these values to customize the form behavior

module.exports = {
  // Email Settings - CHANGE THIS TO YOUR EMAIL ADDRESS
  REPAIR_EMAIL: "crestapex0@gmail.com",  // Email where repair requests will be sent
  SENDER_EMAIL: "crestapex0@gmail.com",   // Email address used to send the email
  SENDER_PASSWORD: process.env.EMAIL_PASSWORD || "", // Use environment variable for security
  
  // Email Provider Settings (Gmail, Outlook, etc.)
  EMAIL_SERVICE: "gmail", // Change based on your email provider
  
  // Server Settings
  PORT: process.env.PORT || 3000,
  HOST: "localhost",
  
  // CORS Settings - allowed origins
  ALLOWED_ORIGINS: [
    "http://localhost:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    // Add your production domain here when ready
    // "https://yourdomain.com"
  ]
};
