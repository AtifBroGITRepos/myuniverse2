
'use server';

import nodemailer from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpSecure = process.env.SMTP_SECURE === 'true';
const emailFrom = process.env.EMAIL_FROM;

if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !emailFrom) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'SMTP environment variables are not fully set. Email sending will be disabled. Please check your .env file.'
    );
  } else {
     throw new Error(
      'SMTP environment variables are not fully set. Email sending is disabled.'
    );
  }
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: parseInt(smtpPort || '587', 10),
  secure: smtpSecure, 
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  // For development with services like Ethereal, or if you have TLS issues
  // tls: {
  //   rejectUnauthorized: false 
  // }
});

export async function sendEmail({ to, subject, html, text }: MailOptions): Promise<{ success: boolean; messageId?: string; error?: any }> {
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !emailFrom) {
    console.error('SMTP not configured. Skipping email send.');
    // In a real app, you might want to decide if this should throw an error or fail silently
    // For now, it will not send but won't crash the app if called.
    return { success: false, error: 'SMTP not configured on server.' };
  }

  try {
    const info = await transporter.sendMail({
      from: emailFrom,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ''), // Basic text version
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
