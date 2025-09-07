// Hybrid email service: Gmail -> Resend -> Console logging
import { sendVerificationEmail as sendResendEmail, sendPasswordResetEmail as sendResendPasswordReset } from './email';

// Try to import Gmail service
let sendVerificationEmailGmail: any;
let sendPasswordResetEmailGmail: any;

try {
  const gmailService = require('./email-gmail');
  sendVerificationEmailGmail = gmailService.sendVerificationEmailGmail;
  sendPasswordResetEmailGmail = gmailService.sendPasswordResetEmailGmail;
} catch (error) {
  console.log('📧 Gmail service not available, will use Resend fallback');
}

/**
 * Send Verification Email with multiple fallbacks
 * Priority: Gmail -> Resend -> Console logging
 */
export const sendVerificationEmail = async (
  email: string,
  token: string,
  name: string
) => {
  const verificationUrl = `${
    process.env.FRONTEND_URL || "https://prolific-kindness-production-dcce.up.railway.app"
  }/verify-email?token=${token}`;

  // Try Gmail first (if configured)
  if (sendVerificationEmailGmail && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try {
      console.log('📧 Trying Gmail email service...');
      const result = await sendVerificationEmailGmail(email, token, name);
      if (result && !result.fallback) {
        return result;
      }
    } catch (gmailError) {
      console.log('📧 Gmail failed, trying Resend...', gmailError.message);
    }
  }

  // Try Resend second (if configured)
  if (process.env.RESEND_API_KEY) {
    try {
      console.log('📧 Trying Resend email service...');
      return await sendResendEmail(email, token, name);
    } catch (resendError) {
      console.log('📧 Resend failed, using console logging...', resendError.message);
    }
  }

  // Final fallback: Console logging
  console.log("\n📧 EMAIL FALLBACK - MANUAL VERIFICATION REQUIRED:");
  console.log(`🔗 Verification URL: ${verificationUrl}`);
  console.log(`📮 Send this URL to user manually: ${email}`);
  console.log("📧 END MANUAL VERIFICATION INFO\n");
  
  return { fallback: true, verificationUrl };
};

/**
 * Send Password Reset Email with multiple fallbacks
 * Priority: Gmail -> Resend -> Console logging
 */
export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  name: string
) => {
  const resetUrl = `${
    process.env.FRONTEND_URL || "https://prolific-kindness-production-dcce.up.railway.app"
  }/reset-password?token=${token}`;

  // Try Gmail first (if configured)
  if (sendPasswordResetEmailGmail && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try {
      console.log('📧 Trying Gmail password reset...');
      const result = await sendPasswordResetEmailGmail(email, token, name);
      if (result && !result.fallback) {
        return result;
      }
    } catch (gmailError) {
      console.log('📧 Gmail failed, trying Resend...', gmailError.message);
    }
  }

  // Try Resend second (if configured)
  if (process.env.RESEND_API_KEY) {
    try {
      console.log('📧 Trying Resend password reset...');
      return await sendResendPasswordReset(email, token, name);
    } catch (resendError) {
      console.log('📧 Resend failed, using console logging...', resendError.message);
    }
  }

  // Final fallback: Console logging
  console.log("\n📧 PASSWORD RESET FALLBACK - MANUAL RESET REQUIRED:");
  console.log(`🔗 Reset URL: ${resetUrl}`);
  console.log(`📮 Send this URL to user manually: ${email}`);
  console.log("📧 END MANUAL RESET INFO\n");
  
  return { fallback: true, resetUrl };
};
