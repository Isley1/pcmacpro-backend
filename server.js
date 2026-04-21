const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const config = require('./config');

const app = express();

// Helper function to create email transporter based on config
function createTransporter() {
  if (config.EMAIL_SERVICE === 'custom') {
    return nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_SECURE,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD
      }
    });
  } else {
    return nodemailer.createTransport({
      service: config.EMAIL_SERVICE,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_PASSWORD
      }
    });
  }
}

// Middleware
app.use(express.json());
app.use(cors({
  origin: config.ALLOWED_ORIGINS,
  methods: ['POST', 'GET'],
  credentials: true
}));

// Serve static files
app.use(express.static('./'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Form submission endpoint
app.post('/submit-repair-request', async (req, res) => {
  try {
    const { fname, lname, phone, email, deviceType, deviceModel, repairType, issue, serviceOption, source } = req.body;

    // Validate required fields
    if (!fname || !lname || !phone || !deviceType || !deviceModel || !repairType || !issue) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Create email content
    const emailContent = `
      <h2>New Repair Request Received</h2>
      <hr/>
      <h3>Customer Information</h3>
      <p><strong>Name:</strong> ${fname} ${lname}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email || 'Not provided'}</p>
      
      <h3>Device Information</h3>
      <p><strong>Device Type:</strong> ${deviceType}</p>
      <p><strong>Brand & Model:</strong> ${deviceModel}</p>
      
      <h3>Repair Details</h3>
      <p><strong>Repair Type:</strong> ${repairType}</p>
      <p><strong>Issue Description:</strong></p>
      <p>${issue.replace(/\n/g, '<br>')}</p>
      
      <h3>Service Preferences</h3>
      <p><strong>Service Option:</strong> ${serviceOption || 'Not specified'}</p>
      <p><strong>Source:</strong> ${source || 'Not specified'}</p>
      
      <hr/>
      <p><em>Received at: ${new Date().toLocaleString()}</em></p>
    `;

    // Create email transporter
    const transporter = createTransporter();

    // Send email to repair shop
    await transporter.sendMail({
      from: config.SENDER_EMAIL,
      to: config.REPAIR_EMAIL,
      subject: `New Repair Request - ${fname} ${lname}`,
      html: emailContent
    });

    // Optional: Send confirmation email to customer
    if (email) {
      const customerEmailContent = `
        <h2>We've Received Your Repair Request!</h2>
        <p>Hi ${fname},</p>
        <p>Thank you for submitting your repair request. We'll contact you on <strong>${phone}</strong> within 30 minutes to confirm your booking and provide a free quote.</p>
        
        <h3>Your Request Summary:</h3>
        <p><strong>Device:</strong> ${deviceType} - ${deviceModel}</p>
        <p><strong>Repair Type:</strong> ${repairType}</p>
        <p><strong>Service Option:</strong> ${serviceOption || 'Not specified'}</p>
        
        <p>If you have any questions in the meantime, feel free to call us:</p>
        <p>📞 08140768033 or 07072413082</p>
        
        <p>Best regards,<br>PCMAC pro Team</p>
      `;

      await transporter.sendMail({
        from: config.SENDER_EMAIL,
        to: email,
        subject: 'Repair Request Confirmed - PCMAC pro',
        html: customerEmailContent
      });
    }

    res.json({ 
      success: true, 
      message: 'Repair request submitted successfully',
      phone: phone
    });

  } catch (error) {
    console.error('Error submitting repair request:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting repair request. Please try again later.',
      error: error.message
    });
  }
});

// Contact form submission endpoint
app.post('/submit-contact-form', async (req, res) => {
  try {
    const { fname, lname, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!fname || !lname || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Create email content
    const emailContent = `
      <h2>New Contact Message Received</h2>
      <hr/>
      <h3>Sender Information</h3>
      <p><strong>Name:</strong> ${fname} ${lname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      
      <h3>Message Details</h3>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      
      <hr/>
      <p><em>Received at: ${new Date().toLocaleString()}</em></p>
    `;

    // Create email transporter
    const transporter = createTransporter();

    // Send email to repair shop
    await transporter.sendMail({
      from: config.SENDER_EMAIL,
      to: config.REPAIR_EMAIL,
      subject: `New Contact Message - ${fname} ${lname}`,
      html: emailContent
    });

    // Send confirmation email to customer
    const customerEmailContent = `
      <h2>We've Received Your Message!</h2>
      <p>Hi ${fname},</p>
      <p>Thank you for contacting us. We've received your message and will get back to you as soon as possible.</p>
      
      <h3>Your Message Summary:</h3>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message.substring(0, 100)}...</p>
      
      <p>If you need immediate assistance, feel free to call us:</p>
      <p>📞 08140768033 or 07072413082</p>
      
      <p>Best regards,<br>PCMAC pro Team</p>
    `;

    await transporter.sendMail({
      from: config.SENDER_EMAIL,
      to: email,
      subject: 'We Received Your Message - PCMAC pro',
      html: customerEmailContent
    });

    res.json({ 
      success: true, 
      message: 'Contact message submitted successfully',
      email: email
    });

  } catch (error) {
    console.error('Error submitting contact form:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting contact form. Please try again later.',
      error: error.message
    });
  }
});

// Start server
app.listen(config.PORT, () => {
  console.log(`PCMAC pro Repair Form Server running on http://${config.HOST}:${config.PORT}`);
  console.log(`Repair requests will be sent to: ${config.REPAIR_EMAIL}`);
});
