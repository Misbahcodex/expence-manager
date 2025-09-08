import nodemailer from 'nodemailer';

/**
 * Create Gmail transporter
 */
const createGmailTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in environment variables.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000, // 5 seconds
    socketTimeout: 10000, // 10 seconds
  });
};

/**
 * Send Verification Email using Gmail
 */
export const sendVerificationEmail = async (
  email: string,
  token: string,
  name: string
) => {
  const verificationUrl = `${
    process.env.FRONTEND_URL || "https://prolific-kindness-production-dcce.up.railway.app"
  }/verify-email?token=${token}`;

  console.log(`📧 Sending verification email to: ${email}`);
  console.log('🔧 Gmail config check:');
  console.log('- GMAIL_USER exists:', !!process.env.GMAIL_USER);
  console.log('- GMAIL_APP_PASSWORD exists:', !!process.env.GMAIL_APP_PASSWORD);
  console.log('- GMAIL_USER value:', process.env.GMAIL_USER ? process.env.GMAIL_USER.substring(0, 3) + '***' : 'not set');

  // Fallback logging if Gmail not configured
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log("\n📧 GMAIL NOT CONFIGURED - MANUAL VERIFICATION:");
    console.log(`🔗 Verification URL: ${verificationUrl}`);
    console.log(`📮 Send this URL to: ${email}`);
    console.log("📧 Configure Gmail credentials for automatic emails\n");
    return { fallback: true, verificationUrl };
  }

  try {
    const transporter = createGmailTransporter();

    const mailOptions = {
      from: `"Expense Manager" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - Expense Manager',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Email Verification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Expense Manager</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Welcome, ${name}! 🎉</h2>
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              Thank you for joining Expense Manager! We're excited to help you track your finances and manage your expenses.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 30px;">
              To get started, please verify your email address by clicking the button below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        font-size: 16px; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);">
                ✅ Verify Email Address
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="word-break: break-all; font-size: 12px; color: #4CAF50; background: #f0f0f0; padding: 10px; border-radius: 5px;">
              ${verificationUrl}
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center;">
              This email was sent from Expense Manager. If you didn't create an account, please ignore this email.
            </p>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully:', result.messageId);
    return result;

  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    
    // Fallback logging
    console.log("\n📧 EMAIL FAILED - MANUAL VERIFICATION REQUIRED:");
    console.log(`🔗 Verification URL: ${verificationUrl}`);
    console.log(`📮 Send this URL to: ${email}`);
    console.log("📧 Check Gmail credentials and try again\n");
    
    throw error;
  }
};

/**
 * Send Password Reset Email using Gmail
 */
export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  name: string
) => {
  const resetUrl = `${
    process.env.FRONTEND_URL || "https://prolific-kindness-production-dcce.up.railway.app"
  }/reset-password?token=${token}`;

  console.log(`📧 Sending password reset email to: ${email}`);

  // Fallback logging if Gmail not configured
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log("\n📧 GMAIL NOT CONFIGURED - MANUAL PASSWORD RESET:");
    console.log(`🔗 Reset URL: ${resetUrl}`);
    console.log(`📮 Send this URL to: ${email}`);
    console.log("📧 Configure Gmail credentials for automatic emails\n");
    return { fallback: true, resetUrl };
  }

  try {
    const transporter = createGmailTransporter();

    const mailOptions = {
      from: `"Expense Manager" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Password Reset - Expense Manager',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Expense Manager</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Password Reset Request 🔐</h2>
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              Hello ${name},
            </p>
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              We received a request to reset your password for your Expense Manager account.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 30px;">
              Click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        font-size: 16px; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);">
                🔒 Reset Password
              </a>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-weight: bold;">⏰ This link expires in 1 hour</p>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="word-break: break-all; font-size: 12px; color: #ff6b6b; background: #f0f0f0; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center;">
              If you didn't request this password reset, please ignore this email. Your password will not be changed.
            </p>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', result.messageId);
    return result;

  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    
    // Fallback logging
    console.log("\n📧 EMAIL FAILED - MANUAL PASSWORD RESET REQUIRED:");
    console.log(`🔗 Reset URL: ${resetUrl}`);
    console.log(`📮 Send this URL to: ${email}`);
    console.log("📧 Check Gmail credentials and try again\n");
    
    throw error;
  }
};
