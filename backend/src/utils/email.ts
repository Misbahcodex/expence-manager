import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string, name: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - Expense Manager',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">Expense Manager</h1>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to Expense Manager!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Thank you for registering with Expense Manager. Please verify your email address by clicking the button below to complete your registration:
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4CAF50; 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block; 
                      font-weight: bold;
                      font-size: 16px;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              Verify Email Address
            </a>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 30px 0;">
            <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">
              <strong>Button not working?</strong> Copy and paste this link into your browser:
            </p>
            <p style="word-break: break-all; color: #4CAF50; font-size: 12px; margin: 0;">
              ${verificationUrl}
            </p>
          </div>
          
          <p style="color: #999; font-size: 14px; margin: 30px 0 10px 0;">
            This verification link will expire in 24 hours for security reasons.
          </p>
          
          <p style="color: #999; font-size: 14px; margin: 0;">
            If you didn't create an account with Expense Manager, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; margin: 0; text-align: center;">
            Best regards,<br>
            <strong>Expense Manager Team</strong>
          </p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, token: string, name: string) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset - Expense Manager',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">Expense Manager</h1>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            You requested a password reset for your Expense Manager account. Click the button below to reset your password:
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetUrl}" 
               style="background-color: #f44336; 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block; 
                      font-weight: bold;
                      font-size: 16px;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              Reset Password
            </a>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 30px 0;">
            <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">
              <strong>Button not working?</strong> Copy and paste this link into your browser:
            </p>
            <p style="word-break: break-all; color: #f44336; font-size: 12px; margin: 0;">
              ${resetUrl}
            </p>
          </div>
          
          <p style="color: #999; font-size: 14px; margin: 30px 0 10px 0;">
            This reset link will expire in 1 hour for security reasons.
          </p>
          
          <p style="color: #999; font-size: 14px; margin: 0;">
            If you didn't request this password reset, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; margin: 0; text-align: center;">
            Best regards,<br>
            <strong>Expense Manager Team</strong>
          </p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};
