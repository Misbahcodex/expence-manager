"use strict";
/**
 * Railway-Compatible Email Service using HTTP-based Resend API
 * (Gmail SMTP is blocked on Railway due to port restrictions)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendVerificationEmail = void 0;
/**
 * Send email via HTTP request (Railway compatible)
 */
async function sendEmailViaHttp(to, subject, html, from = "Expense Manager <onboarding@resend.dev>") {
    // If no Resend API key, provide fallback
    if (!process.env.RESEND_API_KEY) {
        console.log('⚠️ No RESEND_API_KEY found - email service unavailable');
        return {
            success: false,
            error: 'Email service not configured'
        };
    }
    try {
        console.log(`📧 Sending email via HTTP to: ${to}`);
        console.log(`🔧 Using from: ${from}`);
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from,
                to,
                subject,
                html,
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Resend API error: ${JSON.stringify(data)}`);
        }
        console.log('✅ Email sent successfully via HTTP:', data.id || 'unknown');
        return {
            success: true,
            messageId: data.id
        };
    }
    catch (error) {
        console.error('❌ HTTP email sending failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
/**
 * Send Verification Email
 */
const sendVerificationEmail = async (email, token, name) => {
    const verificationUrl = `${process.env.FRONTEND_URL || "https://prolific-kindness-production-dcce.up.railway.app"}/verify-email?token=${token}`;
    const html = `
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
  `;
    const result = await sendEmailViaHttp(email, 'Verify Your Email - Expense Manager', html);
    if (!result.success) {
        // Provide manual verification URL
        console.log('\n📧 EMAIL SENDING FAILED - MANUAL VERIFICATION REQUIRED:');
        console.log(`🔗 Verification URL: ${verificationUrl}`);
        console.log(`📮 Send this URL to user manually: ${email}`);
        console.log('📧 Configure RESEND_API_KEY for automatic emails\n');
        // Don't throw error - let user signup succeed with manual verification
        return;
    }
    console.log('✅ Verification email sent successfully');
};
exports.sendVerificationEmail = sendVerificationEmail;
/**
 * Send Password Reset Email
 */
const sendPasswordResetEmail = async (email, token, name) => {
    const resetUrl = `${process.env.FRONTEND_URL || "https://prolific-kindness-production-dcce.up.railway.app"}/reset-password?token=${token}`;
    const html = `
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
  `;
    const result = await sendEmailViaHttp(email, 'Password Reset - Expense Manager', html);
    if (!result.success) {
        console.log('\n📧 PASSWORD RESET EMAIL FAILED:');
        console.log(`🔗 Reset URL: ${resetUrl}`);
        console.log(`📮 Send this URL to user manually: ${email}`);
        throw new Error('Failed to send password reset email');
    }
    console.log('✅ Password reset email sent successfully');
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
//# sourceMappingURL=email-railway.js.map