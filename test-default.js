const { Resend } = require('resend');

const resend = new Resend('re_BsPZ4MPx_HmmvMTzHt9KTDmPSA7n9PGGe');

async function testResendDefault() {
  try {
    console.log('🧪 Testing Resend with default domain...');
    
    const { data, error } = await resend.emails.send({
      from: 'Expense Manager <onboarding@resend.dev>',
      to: 'adilmisbah25@gmail.com',
      subject: 'Test Email - Default Domain',
      html: '<h1>Test Successful!</h1><p>If you receive this, the default domain works!</p>'
    });

    if (error) {
      console.error('❌ Error:', error);
    } else {
      console.log('✅ Success! Email sent:', data);
      console.log('📧 Check your email: adilmisbah25@gmail.com');
    }
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

testResendDefault();
