import { Router } from 'express';
import { sendEmail } from '../utils/mailer';

const router = Router();

router.get('/test-email', async (req, res) => {
  try {
    await sendEmail({
      to: 'youremail@example.com',
      subject: 'Test Email',
      html: '<h1>This is a test email from Notes App</h1>',
    });
    res.send('✅ Email sent successfully');
  } catch (error) {
    res.status(500).send('❌ Failed to send email');
  }
});

export default router;
