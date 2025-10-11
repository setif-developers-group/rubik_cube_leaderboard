// Test simple d'envoi d'email
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true,
  logger: true,
  tls: {
    rejectUnauthorized: false
  }
});

const testEmail = async () => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'yasmineharfouche0@gmail.com',
      subject: 'Test Email - QR Code System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a0a; color: #ffffff;">
          <h1 style="color: #00FFFF; text-align: center;">TEST EMAIL</h1>
          <p style="text-align: center; color: #cccccc;">Si vous voyez ce message, l'email fonctionne !</p>

          <div style="text-align: center; margin: 30px 0;">
            <div style="width: 200px; height: 200px; background: #00FF00; margin: 0 auto; display: flex; align-items: center; justify-content: center; border-radius: 10px;">
              <span style="color: #000; font-size: 24px; font-weight: bold;">QR TEST</span>
            </div>
          </div>

          <p style="text-align: center; color: #ffffff;">Timestamp: ${Date.now()}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
  } catch (error) {
    console.error('❌ Test email failed:', error);
  }
};

testEmail();