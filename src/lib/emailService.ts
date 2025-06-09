
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
const smtpSecure = process.env.SMTP_SECURE === 'true'; // Explicitly boolean
const emailFrom = process.env.EMAIL_FROM;

const isSmtpConfigured = smtpHost && smtpPort && smtpUser && smtpPass && emailFrom;

if (!isSmtpConfigured) {
  const missingVars = [
    !smtpHost && "SMTP_HOST",
    !smtpPort && "SMTP_PORT",
    !smtpUser && "SMTP_USER",
    !smtpPass && "SMTP_PASS",
    !emailFrom && "EMAIL_FROM",
  ].filter(Boolean).join(", ");

  const errorMessage = `SMTP environment variables are not fully set. Missing: ${missingVars}. Email sending will be disabled. Please check your .env file.`;
  if (process.env.NODE_ENV === 'development') {
    console.warn(errorMessage);
  } else {
    // In production, this might be too noisy or sensitive to throw an error for every call.
    // Logging an error is generally better.
    console.error(errorMessage);
  }
}

let transporter: nodemailer.Transporter | null = null;
if (isSmtpConfigured) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort!, 10), // smtpPort is checked in isSmtpConfigured
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    // Adding a timeout might be useful for debugging connection issues
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000, // 10 seconds
    socketTimeout: 10000, // 10 seconds
  });
} else {
  console.warn("SMTP Transporter not created due to missing configuration.");
}

export async function sendEmail({ to, subject, html, text }: MailOptions): Promise<{ success: boolean; messageId?: string; error?: any }> {
  if (!transporter) {
    console.error('SMTP not configured or transporter not initialized. Skipping email send.');
    return { success: false, error: 'SMTP not configured on server or transporter failed to initialize.' };
  }

  const mailOptions = {
    from: emailFrom, // This is guaranteed by isSmtpConfigured check
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>?/gm, ''), // Basic text version
  };

  console.log(`Attempting to send email with options: From: ${mailOptions.from}, To: ${mailOptions.to}, Subject: ${mailOptions.subject}`);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Error sending email to ${to}. Subject: "${subject}". Error:`, error);
    // Log the full error object for more details
    // console.error("Full SMTP error object:", JSON.stringify(error, null, 2)); 
    // Be cautious with logging full error in production if it might contain sensitive info,
    // but for debugging it's useful. 'error.message', 'error.code', 'error.responseCode' are often key.
    return { success: false, error: error instanceof Error ? error.message : JSON.stringify(error) };
  }
}

