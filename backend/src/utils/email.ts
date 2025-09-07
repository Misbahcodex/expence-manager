import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Send Verification Email
 */
export const sendVerificationEmail = async (
  email: string,
  token: string,
  name: string
) => {
  const verificationUrl = `${
    process.env.FRONTEND_URL || "https://prolific-kindness-production-dcce.up.railway.app"
  }/verify-email?token=${token}`;

  // If no Resend API key, use mock email (development mode)
  if (!resend) {
    console.log("\n🔗 VERIFICATION URL FOR TESTING:");
    console.log(verificationUrl);
    console.log("🔗 END VERIFICATION URL\n");
    
    console.log("📧 EMAIL WOULD BE SENT:");
    console.log(`From: Expense Manager <onboarding@resend.dev>`);
    console.log(`To: ${email}`);
    console.log(`Subject: Verify Your Email - Expense Manager`);
    console.log(`Content: Welcome ${name}! Click to verify: ${verificationUrl}`);
    console.log("📧 END EMAIL LOG\n");
    return; // Exit early for mock email
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "Expense Manager <onboarding@resend.dev>",
      to: email,
      subject: "Verify Your Email - Expense Manager",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0;">
          <div style="max-width:600px; margin:0 auto; background:#fff; padding:20px;">
            <h1 style="text-align:center; color:#333;">Expense Manager</h1>
            <h2>Welcome, ${name}!</h2>
            <p>Please verify your email address by clicking below:</p>
            <div style="text-align:center; margin:30px 0;">
              <a href="${verificationUrl}"
                 style="background:#4CAF50; color:#fff; padding:12px 24px; border-radius:5px; text-decoration:none;">
                Verify Email Address
              </a>
            </div>
            <p>If the button doesn’t work, copy this link:</p>
            <p style="word-break:break-all; font-size:12px; color:#4CAF50;">${verificationUrl}</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) throw error;
    console.log("✅ Verification email sent:", data?.id);
  } catch (err) {
    console.error("❌ Error sending verification email:", err);
    throw err;
  }
};

/**
 * Send Password Reset Email
 */
export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  name: string
) => {
  const resetUrl = `${
    process.env.FRONTEND_URL || "https://prolific-kindness-production-dcce.up.railway.app"
  }/reset-password?token=${token}`;

  // If no Resend API key, use mock email (development mode)
  if (!resend) {
    console.log("\n🔗 PASSWORD RESET URL FOR TESTING:");
    console.log(resetUrl);
    console.log("🔗 END RESET URL\n");
    
    console.log("📧 RESET EMAIL WOULD BE SENT:");
    console.log(`From: Expense Manager <onboarding@resend.dev>`);
    console.log(`To: ${email}`);
    console.log(`Subject: Password Reset - Expense Manager`);
    console.log(`Content: Hello ${name}! Click to reset: ${resetUrl}`);
    console.log("📧 END RESET EMAIL LOG\n");
    return; // Exit early for mock email
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "Expense Manager <onboarding@resend.dev>",
      to: email,
      subject: "Password Reset - Expense Manager",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0;">
          <div style="max-width:600px; margin:0 auto; background:#fff; padding:20px;">
            <h1 style="text-align:center; color:#333;">Expense Manager</h1>
            <h2>Password Reset Request</h2>
            <p>Hello ${name}, click below to reset your password:</p>
            <div style="text-align:center; margin:30px 0;">
              <a href="${resetUrl}"
                 style="background:#f44336; color:#fff; padding:12px 24px; border-radius:5px; text-decoration:none;">
                Reset Password
              </a>
            </div>
            <p>If the button doesn’t work, copy this link:</p>
            <p style="word-break:break-all; font-size:12px; color:#f44336;">${resetUrl}</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) throw error;
    console.log("✅ Password reset email sent:", data?.id);
  } catch (err) {
    console.error("❌ Error sending password reset email:", err);
    throw err;
  }
};
