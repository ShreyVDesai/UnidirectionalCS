import nodemailer from 'nodemailer';

// Create transporter based on environment
const createTransporter = () => {
  // For development/testing - use Gmail SMTP

    console.log('[EMAIL] Using Gmail SMTP for email sending');
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD // Use App Password, not regular password
      }
    });
  
  
  // For production - use AWS SES
//   console.log('[EMAIL] Using AWS SES for email sending');
//   return nodemailer.createTransport({
//     SES: {
//       region: process.env.AWS_REGION,
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//     }
//   });
};

export const sendEmail = async (to: string, subject: string, body: string) => {
  console.log('[EMAIL] Attempting to send email to:', to);
  console.log('[EMAIL] Subject:', subject);
  
  // Check if email is configured
  if (!process.env.GMAIL_USER && !process.env.SES_EMAIL) {
    console.warn('[EMAIL] No email service configured — printing email to console instead of sending');
    console.log('EMAIL TO:', to);
    console.log('SUBJECT:', subject);
    console.log('BODY:', body);
    return;
  }

  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.GMAIL_USER || process.env.SES_EMAIL,
      to: to,
      subject: subject,
      text: body,
      html: `<p>${body.replace(/\n/g, '<br>')}</p>`
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('[EMAIL] Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('[EMAIL] Error sending email:', error);
    throw error;
  }
};
