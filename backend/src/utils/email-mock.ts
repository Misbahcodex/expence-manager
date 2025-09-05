// Mock email service for testing - logs emails to console instead of sending them
export const sendVerificationEmail = async (email: string, token: string, name: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  console.log('\n📧 VERIFICATION EMAIL (Mock)');
  console.log('=====================================');
  console.log(`To: ${email}`);
  console.log(`Name: ${name}`);
  console.log(`Verification URL: ${verificationUrl}`);
  console.log('=====================================\n');
  
  // In a real app, you would send this email
  // For now, we'll just log it so you can copy the URL
};

export const sendPasswordResetEmail = async (email: string, token: string, name: string) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  console.log('\n📧 PASSWORD RESET EMAIL (Mock)');
  console.log('=====================================');
  console.log(`To: ${email}`);
  console.log(`Name: ${name}`);
  console.log(`Reset URL: ${resetUrl}`);
  console.log('=====================================\n');
  
  // In a real app, you would send this email
  // For now, we'll just log it so you can copy the URL
};

