"use strict";
/**
 * Brevo Email Service with SMTP and HTTP API support
 * Primary: HTTP API (Railway compatible)
 * Fallback: SMTP (for other deployments)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
/**
 * Send email via Brevo HTTP API (Primary method - Railway compatible)
 */
async function sendEmailViaBrevoAPI(to, subject, htmlContent, from = { email: "noreply@yourdomain.com", name: "Expense Manager" }) {
    if (!process.env.BREVO_API_KEY) {
        console.log('⚠️ No BREVO_API_KEY found');
        return {
            success: false,
            error: 'Brevo API key not configured'
        };
    }
    try {
        console.log(`📧 Sending email via Brevo API to: ${to}`);
        console.log(`🔧 Using API key: ${process.env.BREVO_API_KEY?.substring(0, 8)}...`);
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
            },
            body: JSON.stringify({
                sender: from,
                to: [{ email: to }],
                subject: subject,
                htmlContent: htmlContent,
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Brevo API error (${response.status}): ${JSON.stringify(errorData)}`);
        }
        const data = await response.json();
        console.log('✅ Email sent successfully via Brevo API:', data.messageId || 'success');
        return {
            success: true,
            messageId: data.messageId
        };
    }
    catch (error) {
        console.error('❌ Brevo API email sending failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
/**
 * Send email via Brevo SMTP (Fallback method)
 */
async function sendEmailViaBrevoSMTP(to, subject, html, from = '"Expense Manager" <noreply@yourdomain.com>') {
    if (!process.env.BREVO_SMTP_LOGIN || !process.env.BREVO_SMTP_PASSWORD) {
        console.log('⚠️ Brevo SMTP credentials not found');
        return {
            success: false,
            error: 'Brevo SMTP credentials not configured'
        };
    }
    try {
        console.log(`📧 Sending email via Brevo SMTP to: ${to}`);
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.BREVO_SMTP_LOGIN,
                pass: process.env.BREVO_SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            },
            connectionTimeout: 10000,
            greetingTimeout: 5000,
            socketTimeout: 10000,
        });
        const mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: html,
        };
        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully via Brevo SMTP:', result.messageId);
        return {
            success: true,
            messageId: result.messageId
        };
    }
    catch (error) {
        console.error('❌ Brevo SMTP email sending failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
/**
 * Send email via Brevo API only (Railway compatible)
 */
async function sendEmail(to, subject, htmlContent) {
    console.log(`📧 Sending email via Brevo API to: ${to}`);
    // Only use Brevo API (Railway compatible - no SMTP timeout)
    const apiResult = await sendEmailViaBrevoAPI(to, subject, htmlContent);
    if (apiResult.success) {
        console.log('✅ Email sent successfully via Brevo API');
        return apiResult;
    }
    console.error('❌ Brevo API email sending failed:', apiResult.error);
    // Check if it's an API key issue
    if (apiResult.error?.includes('401') || apiResult.error?.includes('unauthorized') || apiResult.error?.includes('Key not found')) {
        console.error('🔑 Invalid Brevo API key - check your Railway environment variables');
        console.error('💡 Brevo API keys should look like: xkeysib-xxxxxxxx-xxxxxxxx');
    }
    return {
        success: false,
        error: apiResult.error || 'Brevo API failed'
    };
}
/**
 * Send Verification Email
 */
const sendVerificationEmail = async (email, token, name) => {
    const verificationUrl = `${process.env.FRONTEND_URL || "https://prolific-kindness-production-dcce.up.railway.app"}/verify-email?token=${token}`;
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Email Verification - Expense Manager</title>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f5f5f5;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">Expense Manager</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 16px;">Your Personal Finance Tracker</p>
      </div>
      
      <!-- Body -->
      <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">Welcome, ${name}! 🎉</h2>
        
        <p style="font-size: 16px; margin-bottom: 20px; color: #555;">
          Thank you for joining Expense Manager! We're excited to help you take control of your finances and track your expenses with ease.
        </p>
        
        <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
          <p style="margin: 0; font-size: 16px; color: #333;">
            <strong>🔐 Security First:</strong> To protect your account, please verify your email address before you can start using Expense Manager.
          </p>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 30px; color: #555;">
          Click the button below to verify your email address and activate your account:
        </p>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 35px 0;">
          <a href="${verificationUrl}" 
             style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); 
                    color: white; 
                    padding: 16px 32px; 
                    text-decoration: none; 
                    border-radius: 30px; 
                    font-weight: 600; 
                    font-size: 16px; 
                    display: inline-block;
                    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
                    transition: all 0.3s ease;">
            ✅ Verify Email Address
          </a>
        </div>
        
        <!-- Alternative Link -->
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <p style="font-size: 14px; color: #666; margin: 0 0 10px 0;">
            <strong>Button not working?</strong> Copy and paste this link into your browser:
          </p>
          <p style="word-break: break-all; font-size: 12px; color: #4CAF50; background: white; padding: 12px; border-radius: 5px; border: 1px solid #e0e0e0; margin: 0;">
            ${verificationUrl}
          </p>
        </div>
        
        <!-- Features Preview -->
        <div style="margin: 35px 0; padding: 25px; background: linear-gradient(135deg, #f5f7ff 0%, #e8f2ff 100%); border-radius: 10px;">
          <h3 style="color: #333; margin-top: 0; font-size: 18px;">🚀 What's waiting for you:</h3>
          <ul style="color: #555; margin: 15px 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">📊 <strong>Smart Dashboard</strong> - View your financial overview at a glance</li>
            <li style="margin-bottom: 8px;">💰 <strong>Transaction Tracking</strong> - Easily add and categorize income & expenses</li>
            <li style="margin-bottom: 8px;">📈 <strong>Financial Insights</strong> - Understand your spending patterns</li>
            <li style="margin-bottom: 8px;">🔒 <strong>Secure & Private</strong> - Your financial data is encrypted and safe</li>
          </ul>
        </div>
        
        <!-- Footer -->
        <hr style="border: none; border-top: 1px solid #eee; margin: 35px 0;">
        
        <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
          This email was sent from <strong>Expense Manager</strong><br>
          If you didn't create an account, please ignore this email.
        </p>
        
        <p style="font-size: 11px; color: #ccc; text-align: center; margin: 15px 0 0 0;">
          Powered by Brevo • Delivered with ❤️
        </p>
      </div>
    </body>
    </html>
  `;
    const result = await sendEmail(email, 'Verify Your Email - Expense Manager', htmlContent);
    if (!result.success) {
        // Provide manual verification URL
        console.log('\n📧 EMAIL SENDING FAILED - MANUAL VERIFICATION REQUIRED:');
        console.log(`🔗 Verification URL: ${verificationUrl}`);
        console.log(`📮 Send this URL to user manually: ${email}`);
        console.log('📧 Configure Brevo credentials for automatic emails\n');
        return result; // Return the failed result
    }
    console.log('✅ Verification email sent successfully via Brevo');
    return result;
};
exports.sendVerificationEmail = sendVerificationEmail;
/**
 * Send Password Reset Email
 */
const sendPasswordResetEmail = async (email, token, name) => {
    const resetUrl = `${process.env.FRONTEND_URL || "https://prolific-kindness-production-dcce.up.railway.app"}/reset-password?token=${token}`;
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset - Expense Manager</title>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f5f5f5;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">Expense Manager</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 16px;">Password Reset Request</p>
      </div>
      
      <!-- Body -->
      <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">Hello, ${name}! 🔐</h2>
        
        <p style="font-size: 16px; margin-bottom: 20px; color: #555;">
          We received a request to reset your password for your Expense Manager account.
        </p>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 25px 0;">
          <p style="margin: 0; font-size: 16px; color: #856404;">
            <strong>⏰ Important:</strong> This password reset link will expire in <strong>1 hour</strong> for security reasons.
          </p>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 30px; color: #555;">
          Click the button below to create a new password:
        </p>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 35px 0;">
          <a href="${resetUrl}" 
             style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); 
                    color: white; 
                    padding: 16px 32px; 
                    text-decoration: none; 
                    border-radius: 30px; 
                    font-weight: 600; 
                    font-size: 16px; 
                    display: inline-block;
                    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
                    transition: all 0.3s ease;">
            🔒 Reset My Password
          </a>
        </div>
        
        <!-- Alternative Link -->
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <p style="font-size: 14px; color: #666; margin: 0 0 10px 0;">
            <strong>Button not working?</strong> Copy and paste this link into your browser:
          </p>
          <p style="word-break: break-all; font-size: 12px; color: #ff6b6b; background: white; padding: 12px; border-radius: 5px; border: 1px solid #e0e0e0; margin: 0;">
            ${resetUrl}
          </p>
        </div>
        
        <!-- Security Notice -->
        <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8; margin: 30px 0;">
          <p style="margin: 0; font-size: 14px; color: #0c5460;">
            <strong>🛡️ Security Tip:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure and no changes will be made.
          </p>
        </div>
        
        <!-- Footer -->
        <hr style="border: none; border-top: 1px solid #eee; margin: 35px 0;">
        
        <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
          This email was sent from <strong>Expense Manager</strong><br>
          For security reasons, this link expires in 1 hour.
        </p>
        
        <p style="font-size: 11px; color: #ccc; text-align: center; margin: 15px 0 0 0;">
          Powered by Brevo • Delivered with ❤️
        </p>
      </div>
    </body>
    </html>
  `;
    const result = await sendEmail(email, 'Reset Your Password - Expense Manager', htmlContent);
    if (!result.success) {
        console.log('\n📧 PASSWORD RESET EMAIL FAILED:');
        console.log(`🔗 Reset URL: ${resetUrl}`);
        console.log(`📮 Send this URL to user manually: ${email}`);
        throw new Error('Failed to send password reset email');
    }
    console.log('✅ Password reset email sent successfully via Brevo');
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
//# sourceMappingURL=email-brevo.js.map