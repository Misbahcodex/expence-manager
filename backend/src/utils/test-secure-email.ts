/**
 * Test Secure Email Implementation
 * 
 * This script tests the secure-email.ts implementation to ensure it's working correctly
 * and following security best practices.
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { sendVerificationEmail, sendPasswordResetEmail } from './secure-email';

// Interface to match the response from secure-email.ts
interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  fallbackUrl?: string;
}

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('✅ Loaded environment variables from .env file');
} else {
  console.log('⚠️ No .env file found, checking system environment variables only');
}

// Validate environment variables
const requiredEnvVars = ['RESEND_API_KEY', 'FROM_EMAIL', 'FRONTEND_URL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('Please set these variables in your .env file or environment before running this test.');
  process.exit(1);
}

// Test email address (can be overridden with TEST_EMAIL env var)
const testEmail = process.env.TEST_EMAIL || 'test@example.com';

// Test user data
const testUser = {
  id: 'test-user-id-123',
  email: testEmail,
  name: 'Test User',
  verificationToken: 'test-verification-token-123',
  resetPasswordToken: 'test-reset-token-456'
};

// Test functions
async function testVerificationEmail() {
  console.log('\n🧪 Testing verification email...');
  try {
    const result: EmailResponse = await sendVerificationEmail(testUser.email, testUser.verificationToken, testUser.name);
    if (result.success) {
      console.log('✅ Verification email test successful!');
      console.log('📧 Email sent to:', testUser.email);
      console.log('🆔 Message ID:', result.messageId || 'Not available');
      return true;
    } else {
      console.error('❌ Verification email test failed:', result.error);
      if (result.fallbackUrl) {
        console.log('📮 Fallback URL:', result.fallbackUrl);
      }
      return false;
    }
  } catch (error: any) {
    console.error('❌ Verification email test failed:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
    return false;
  }
}

async function testPasswordResetEmail() {
  console.log('\n🧪 Testing password reset email...');
  try {
    const result: EmailResponse = await sendPasswordResetEmail(testUser.email, testUser.resetPasswordToken, testUser.name);
    if (result.success) {
      console.log('✅ Password reset email test successful!');
      console.log('📧 Email sent to:', testUser.email);
      console.log('🆔 Message ID:', result.messageId || 'Not available');
      return true;
    } else {
      console.error('❌ Password reset email test failed:', result.error);
      if (result.fallbackUrl) {
        console.log('📮 Fallback URL:', result.fallbackUrl);
      }
      return false;
    }
  } catch (error: any) {
    console.error('❌ Password reset email test failed:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
    return false;
  }
}

// Run tests with timeout and proper error handling
async function runTests() {
  console.log('🔒 Testing Secure Email Implementation\n');
  console.log('Using the following configuration:');
  console.log(`- API Key: ${process.env.RESEND_API_KEY ? '****' + process.env.RESEND_API_KEY.substring(process.env.RESEND_API_KEY.length - 4) : 'Not set'}`);
  console.log(`- From Email: ${process.env.FROM_EMAIL || 'Not set'}`);
  console.log(`- Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
  console.log(`- Test Email: ${testEmail}\n`);

  let verificationSuccess = false;
  let passwordResetSuccess = false;

  try {
    // Set timeout for each test
    const timeout = 10000; // 10 seconds
    
    // Test verification email
    const verificationPromise = new Promise<boolean>(async (resolve) => {
      try {
        const result = await testVerificationEmail();
        resolve(result);
      } catch (error) {
        console.error('Verification email test error:', error);
        resolve(false);
      }
    });
    
    verificationSuccess = await Promise.race([
      verificationPromise,
      new Promise<boolean>(resolve => setTimeout(() => {
        console.error('❌ Verification email test timed out after', timeout / 1000, 'seconds');
        resolve(false);
      }, timeout))
    ]);
    
    // Test password reset email
    const passwordResetPromise = new Promise<boolean>(async (resolve) => {
      try {
        const result = await testPasswordResetEmail();
        resolve(result);
      } catch (error) {
        console.error('Password reset email test error:', error);
        resolve(false);
      }
    });
    
    passwordResetSuccess = await Promise.race([
      passwordResetPromise,
      new Promise<boolean>(resolve => setTimeout(() => {
        console.error('❌ Password reset email test timed out after', timeout / 1000, 'seconds');
        resolve(false);
      }, timeout))
    ]);
  } catch (error) {
    console.error('❌ Tests failed with an unexpected error:', error);
  }

  // Summary
  console.log('\n📋 Test Summary:');
  console.log(`- Verification Email: ${verificationSuccess ? '✅ Passed' : '❌ Failed'}`);
  console.log(`- Password Reset Email: ${passwordResetSuccess ? '✅ Passed' : '❌ Failed'}`);
  
  if (verificationSuccess && passwordResetSuccess) {
    console.log('\n🎉 All tests passed! The secure email implementation is working correctly.');
    process.exit(0);
  } else {
    console.log('\n⚠️ Some tests failed. Please check the error messages above.');
    process.exit(1);
  }
}

// Handle signals for clean exit
process.on('SIGINT', () => {
  console.log('\n⚠️ Tests interrupted. Exiting...');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n⚠️ Tests terminated. Exiting...');
  process.exit(1);
});

// Run the tests
runTests().catch(error => {
  console.error('❌ Unhandled error during tests:', error);
  process.exit(1);
});