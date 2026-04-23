// Configuration file for PCMAC pro repair form
// Edit these values to customize the form behavior

module.exports = {
  // Email Settings - CHANGE THIS TO YOUR EMAIL ADDRESS
  REPAIR_EMAIL: "contact@pcmacpro.org",  // Email where repair requests will be sent
  SENDER_EMAIL: "contact@pcmacpro.org",   // Email address used to send the email
  SENDER_PASSWORD: process.env.EMAIL_PASSWORD || "", // Use environment variable for security
  
  // Email Provider Settings
  // For custom domain: use "custom" and configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
  // For Gmail: use "gmail"
  EMAIL_SERVICE: "custom", // Change to "gmail" for Gmail or "custom" for domain email
  
  // Custom SMTP Settings (for non-Gmail email providers)
  SMTP_HOST: process.env.SMTP_HOST || "mail.pcmacpro.org", // Your domain's mail server
  SMTP_PORT: process.env.SMTP_PORT || 465, // Usually 587 (TLS) or 465 (SSL)
  SMTP_SECURE: process.env.SMTP_SECURE || true, // true for port 465, false for 587
  SMTP_USER: process.env.SMTP_USER || "contact@pcmacpro.org", // Your email address
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD || "", // Your email password
  
  // Server Settings
  PORT: process.env.PORT || 3000,
  HOST: "localhost",
  
  // CORS Settings - allowed origins
  ALLOWED_ORIGINS: [
    "http://localhost:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://pcmacpro.org"
  ]
};
