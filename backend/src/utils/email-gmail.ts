// Gmail email service with fallback
let nodemailer: any;
try {
  nodemailer = require('nodemailer');
} catch (error) {
  console.log('📧 Nodemailer not available, using fallback email logging');
}

// Gmail SMTP transporter with fallback
const createTransporter = () => {
  if (!nodemailer) {
    throw new Error('Nodemailer not available');
  }
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail address
      pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password
    },
  });
};

/**
 * Send Verification Email using Gmail
 */
export const sendVerificationEmailGmail = async (
  email: string,
  token: string,
  name: string
) => {
  const verificationUrl = `${
    process.env.FRONTEND_URL || "https://prolific-kindness-production-dcce.up.railway.app"
  }/verify-email?token=${token}`;

  console.log(`🔄 Sending verification email via Gmail to: ${email}`);

  // Fallback if Gmail not configured
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !nodemailer) {
    console.log("\n📧 GMAIL NOT CONFIGURED - MANUAL VERIFICATION REQUIRED:");
    console.log(`🔗 Verification URL: ${verificationUrl}`);
    console.log(`📮 Send this URL to user manually: ${email}`);
    console.log("📧 END MANUAL VERIFICATION INFO\n");
    return { fallback: true, verificationUrl };
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"Expense Manager" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - Expense Manager',
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
          <p>If the button doesn't work, copy this link:</p>
          <p style="word-break:break-all; font-size:12px; color:#4CAF50;">${verificationUrl}</p>
          <hr style="margin:30px 0;">
          <p style="color:#666; font-size:12px;">
            This email was sent from Expense Manager. If you didn't create an account, please ignore this email.
          </p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Gmail verification email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Gmail email sending failed:', error);
    throw error;
  }
};

/**
 * Send Password Reset Email using Gmail
 */
export const sendPasswordResetEmailGmail = async (
  email: string,
  token: string,
  name: string
) => {
  const resetUrl = `${
    process.env.FRONTEND_URL || "https://prolific-kindness-production-dcce.up.railway.app"
  }/reset-password?token=${token}`;

  console.log(`🔄 Sending password reset email via Gmail to: ${email}`);

  // Fallback if Gmail not configured
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !nodemailer) {
    console.log("\n📧 GMAIL NOT CONFIGURED - MANUAL PASSWORD RESET REQUIRED:");
    console.log(`🔗 Reset URL: ${resetUrl}`);
    console.log(`📮 Send this URL to user manually: ${email}`);
    console.log("📧 END MANUAL RESET INFO\n");
    return { fallback: true, resetUrl };
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"Expense Manager" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Password Reset - Expense Manager',
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
          <p>If the button doesn't work, copy this link:</p>
          <p style="word-break:break-all; font-size:12px; color:#f44336;">${resetUrl}</p>
          <p><strong>This link expires in 1 hour.</strong></p>
          <hr style="margin:30px 0;">
          <p style="color:#666; font-size:12px;">
            If you didn't request this password reset, please ignore this email.
          </p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Gmail password reset email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Gmail password reset email failed:', error);
    throw error;
  }
};
