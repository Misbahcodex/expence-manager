const { Resend } = require('resend');

const resend = new Resend('re_BsPZ4MPx_HmmvMTzHt9KTDmPSA7n9PGGe');

async function testResend() {
  try {
    console.log('🧪 Testing Resend API...');
    
    const { data, error } = await resend.emails.send({
      from: 'Expense Manager <adilmisbah25@gmail.com>',
      to: 'adilmisbah25@gmail.com',
      subject: 'Test Email',
      html: '<h1>Test Email</h1><p>If you see this, Resend API is working!</p>'
    });

    if (error) {
      console.error('❌ Resend API Error:', error);
    } else {
      console.log('✅ Resend API Success:', data);
    }
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

testResend();
