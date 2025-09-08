"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendVerificationEmail = void 0;
// Hybrid email service: Gmail -> Resend -> Console logging
const email_1 = require("./email");
// Try to import Gmail service
let sendVerificationEmailGmail;
let sendPasswordResetEmailGmail;
try {
    const gmailService = require('./email-gmail');
    sendVerificationEmailGmail = gmailService.sendVerificationEmailGmail;
    sendPasswordResetEmailGmail = gmailService.sendPasswordResetEmailGmail;
}
catch (error) {
    console.log('📧 Gmail service not available, will use Resend fallback');
}
/**
 * Send Verification Email with multiple fallbacks
 * Priority: Gmail -> Resend -> Console logging
 */
const sendVerificationEmail = async (email, token, name) => {
    const verificationUrl = `${process.env.FRONTEND_URL || "https://prolific-kindness-production-dcce.up.railway.app"}/verify-email?token=${token}`;
    // Try Gmail first (if configured)
    if (sendVerificationEmailGmail && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        try {
            console.log('📧 Trying Gmail email service...');
            const result = await sendVerificationEmailGmail(email, token, name);
            if (result && !result.fallback) {
                return result;
            }
        }
        catch (gmailError) {
            console.log('📧 Gmail failed, trying Resend...', gmailError.message);
        }
    }
    // Try Resend second (if configured)
    if (process.env.RESEND_API_KEY) {
        try {
            console.log('📧 Trying Resend email service...');
            return await (0, email_1.sendVerificationEmail)(email, token, name);
        }
        catch (resendError) {
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
exports.sendVerificationEmail = sendVerificationEmail;
/**
 * Send Password Reset Email with multiple fallbacks
 * Priority: Gmail -> Resend -> Console logging
 */
const sendPasswordResetEmail = async (email, token, name) => {
    const resetUrl = `${process.env.FRONTEND_URL || "https://prolific-kindness-production-dcce.up.railway.app"}/reset-password?token=${token}`;
    // Try Gmail first (if configured)
    if (sendPasswordResetEmailGmail && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        try {
            console.log('📧 Trying Gmail password reset...');
            const result = await sendPasswordResetEmailGmail(email, token, name);
            if (result && !result.fallback) {
                return result;
            }
        }
        catch (gmailError) {
            console.log('📧 Gmail failed, trying Resend...', gmailError.message);
        }
    }
    // Try Resend second (if configured)
    if (process.env.RESEND_API_KEY) {
        try {
            console.log('📧 Trying Resend password reset...');
            return await (0, email_1.sendPasswordResetEmail)(email, token, name);
        }
        catch (resendError) {
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
exports.sendPasswordResetEmail = sendPasswordResetEmail;
//# sourceMappingURL=email-hybrid.js.map