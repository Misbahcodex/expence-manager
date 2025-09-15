import { Resend } from "resend";

// Interface for email response
interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  fallbackUrl?: string;
}

// Email configuration validation
function validateEmailConfig(): boolean {
  const requiredVars = ['RESEND_API_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing email configuration: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
}

// Secure Resend instance with lazy initialization
let resendInstance: Resend | null = null;

function getResendInstance(): Resend | null {
  // Check if configuration is valid
  if (!validateEmailConfig()) {
    return null;
  }
  
  // Lazy initialization to prevent startup crashes
  if (!resendInstance) {
    try {
      // Get API key from environment variables
      const apiKey = process.env.RESEND_API_KEY as string;
      
      // Validate API key format
      if (!apiKey.startsWith('re_') || apiKey.length < 20) {
        console.error('❌ Invalid Resend API key format');
        return null;
      }
      
      // Initialize Resend
      resendInstance = new Resend(apiKey);
      console.log(`✅ Resend initialized successfully`);
    } catch (error) {
      console.error('❌ Failed to initialize Resend:', error);
      return null;
    }
  }
  
  return resendInstance;
}

/**
 * Send email securely using Resend API
 */
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  fromOverride?: string
): Promise<EmailResponse> {
  // Validate recipient email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(to)) {
    console.error(`❌ Invalid recipient email format: ${to}`);
    return {
      success: false,
      error: 'Invalid recipient email format'
    };
  }
  
  // Get Resend instance
  const resend = getResendInstance();
  if (!resend) {
    console.warn('⚠️ Resend not initialized - email service unavailable');
    return {
      success: false,
      error: 'Email service not configured'
    };
  }
  
  // Get sender email from environment variables or use default
  const from = fromOverride || process.env.FROM_EMAIL || "Expense Manager <onboarding@resend.dev>";
  
  try {
    // Log email sending (with masked recipient for privacy)
    const maskedEmail = to.replace(/^(.{3})(.*)@(.*)$/, '$1***@$3');
    console.log(`🔄 Sending email to: ${maskedEmail}`);
    
    // Send email
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    // Handle error
    if (error) {
      console.error('❌ Resend API Error:', error);
      return {
        success: false,
        error: `Resend API Error: ${JSON.stringify(error)}`
      };
    }
    
    // Log success
    console.log("✅ Email sent successfully:", data?.id);
    return {
      success: true,
      messageId: data?.id
    };
  } catch (err) {
    // Handle unexpected errors
    console.error("❌ Error sending email:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}

/**
 * Send Verification Email
 */
export const sendVerificationEmail = async (
  email: string,
  token: string,
  name: string
): Promise<EmailResponse> => {
  // Build verification URL
  const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${token}`;

  // Create email HTML content
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Expense Manager</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Email Verification 📧</h2>
        
        <p style="font-size: 16px; margin-bottom: 25px;">
          Hello ${name},
        </p>
        
        <p style="font-size: 16px; margin-bottom: 25px;">
          Thank you for registering with Expense Manager. Please verify your email address to continue.
        </p>
        
        <p style="font-size: 16px; margin-bottom: 30px;">
          Click the button below to verify your email:
        </p>
        
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">Verify Email</a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-bottom: 5px;">
          If the button doesn't work, copy and paste this URL into your browser:
        </p>
        
        <p style="font-size: 14px; background-color: #f0f0f0; padding: 10px; border-radius: 5px; word-break: break-all;">
          ${verificationUrl}
        </p>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
          If you didn't create an account with Expense Manager, you can safely ignore this email.
        </p>
      </div>
    </body>
    </html>
  `;

  // Send email
  const result = await sendEmail(
    email,
    'Verify Your Email - Expense Manager',
    html
  );

  // If email sending fails, log verification URL for manual verification
  if (!result.success) {
    console.log('\n📧 EMAIL SENDING FAILED - MANUAL VERIFICATION REQUIRED:');
    console.log(`🔗 Verification URL: ${verificationUrl}`);
    console.log(`📮 Send this URL to user manually: ${email}`);
    console.log('📧 END MANUAL VERIFICATION INFO\n');
    
    // Add fallback URL to result
    result.fallbackUrl = verificationUrl;
  }

  return result;
};

/**
 * Send Password Reset Email
 */
export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  name: string
): Promise<EmailResponse> => {
  // Build reset URL
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${token}`;

  // Create email HTML content
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
        
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${resetUrl}" style="background-color: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">Reset Password</a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-bottom: 5px;">
          If the button doesn't work, copy and paste this URL into your browser:
        </p>
        
        <p style="font-size: 14px; background-color: #f0f0f0; padding: 10px; border-radius: 5px; word-break: break-all;">
          ${resetUrl}
        </p>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
          If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </p>
      </div>
    </body>
    </html>
  `;

  // Send email
  const result = await sendEmail(
    email,
    'Password Reset - Expense Manager',
    html
  );

  // If email sending fails, log reset URL for manual reset
  if (!result.success) {
    console.log('\n📧 PASSWORD RESET EMAIL FAILED:');
    console.log(`🔗 Reset URL: ${resetUrl}`);
    console.log(`📮 Send this URL to user manually: ${email}`);
    console.log('📧 END MANUAL RESET INFO\n');
    
    // Add fallback URL to result
    result.fallbackUrl = resetUrl;
  }

  return result;
};