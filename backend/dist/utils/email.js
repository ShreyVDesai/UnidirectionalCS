"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Create transporter using Gmail SMTP
const createTransporter = () => {
    console.log('[EMAIL] Using Gmail SMTP for email sending');
    return nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD // Use App Password, not regular password
        }
    });
};
const sendEmail = async (to, subject, body) => {
    console.log('[EMAIL] Attempting to send email to:', to);
    console.log('[EMAIL] Subject:', subject);
    // Check if email is configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('[EMAIL] Gmail credentials not configured — printing email to console instead of sending');
        console.log('EMAIL TO:', to);
        console.log('SUBJECT:', subject);
        console.log('BODY:', body);
        return;
    }
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: to,
            subject: subject,
            text: body,
            html: `<p>${body.replace(/\n/g, '<br>')}</p>`
        };
        const result = await transporter.sendMail(mailOptions);
        console.log('[EMAIL] Email sent successfully:', result.messageId);
        return result;
    }
    catch (error) {
        console.error('[EMAIL] Error sending email:', error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
