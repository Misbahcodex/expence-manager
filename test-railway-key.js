// Test the exact API key you have in Railway
const { Resend } = require('resend');

// This is the EXACT key that should work
const API_KEY = 're_BsPZ4MPx_HmmvMTzHt9KTDmPSA7n9PGGe';

console.log('🧪 Testing API Key:', API_KEY);
console.log('Key length:', API_KEY.length);
console.log('Key starts with "re_":', API_KEY.startsWith('re_'));

const resend = new Resend(API_KEY);

async function testKey() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Expense Manager <onboarding@resend.dev>',
      to: 'adilmisbah25@gmail.com',
      subject: 'Railway Key Test',
      html: '<h1>SUCCESS!</h1><p>Your Railway API key is working correctly!</p>'
    });

    if (error) {
      console.error('❌ API Key Error:', error);
      console.log('\n💡 If you see this error, the API key in Railway is wrong');
    } else {
      console.log('✅ SUCCESS! API Key works:', data?.id);
      console.log('📧 Check your email for confirmation');
    }
  } catch (err) {
    console.error('❌ Test failed:', err);
  }
}

testKey();
