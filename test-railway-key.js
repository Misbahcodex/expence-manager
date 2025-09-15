// Test the Resend API key from environment variables
const { Resend } = require('resend');
require('dotenv').config();

// Get API key from environment variables
const API_KEY = process.env.RESEND_API_KEY || 'missing_api_key';

// Mask API key for security in logs
const maskedKey = API_KEY === 'missing_api_key' ? 'missing_api_key' : 
  API_KEY.substring(0, 5) + '...' + API_KEY.substring(API_KEY.length - 3);

console.log('🧪 Testing API Key:', maskedKey);
console.log('Key length:', API_KEY.length);
console.log('Key starts with "re_":', API_KEY.startsWith('re_'));

// Validate API key format
if (API_KEY === 'missing_api_key') {
  console.error('❌ ERROR: No API key found in environment variables');
  console.log('💡 Make sure to set RESEND_API_KEY in your .env file or environment variables');
  process.exit(1);
}

if (!API_KEY.startsWith('re_') || API_KEY.length < 20) {
  console.error('❌ ERROR: Invalid API key format');
  console.log('💡 Resend API keys should start with "re_" and be at least 20 characters long');
  process.exit(1);
}

const resend = new Resend(API_KEY);

async function testKey() {
  try {
    // Validate recipient email
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(testEmail)) {
      console.error('❌ ERROR: Invalid test email format');
      console.log('💡 Set a valid TEST_EMAIL in your environment variables');
      process.exit(1);
    }
    
    console.log(`🔄 Sending test email to: ${testEmail}`);
    
    // Use environment variable for sender or default to safe value
    const fromEmail = process.env.FROM_EMAIL || 'Expense Manager <onboarding@resend.dev>';
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: testEmail,
      subject: 'API Key Test - ' + new Date().toISOString(),
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h1 style="color: #4CAF50;">SUCCESS!</h1>
          <p>Your Resend API key is working correctly!</p>
          <p>Time of test: ${new Date().toLocaleString()}</p>
          <p>This is a security test email. If you did not request this test, please check your application security.</p>
        </div>
      `
    });

    if (error) {
      console.error('❌ API Key Error:', error);
      console.log('\n💡 If you see this error, check that:');
      console.log('  1. Your API key is correct');
      console.log('  2. Your sender domain is verified in Resend');
      console.log('  3. Your account has sufficient credits');
      process.exit(1);
    } else {
      console.log('✅ SUCCESS! API Key works:', data?.id);
      console.log(`📧 Check ${testEmail} for confirmation`);
    }
  } catch (err) {
    console.error('❌ Test failed:', err);
    console.log('\n💡 Check your network connection and API key validity');
    process.exit(1);
  }
}

// Set timeout for API call to prevent hanging
const TEST_TIMEOUT = 10000; // 10 seconds

// Execute with proper error handling
const testPromise = testKey();
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Test timed out after ' + TEST_TIMEOUT + 'ms')), TEST_TIMEOUT);
});

// Handle test execution with timeout
Promise.race([testPromise, timeoutPromise])
  .catch(err => {
    console.error('❌ Test execution failed:', err.message);
    process.exit(1);
  });

// Add signal handlers for clean exit
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted by user');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('\n❌ Uncaught exception:', err);
  process.exit(1);
});
