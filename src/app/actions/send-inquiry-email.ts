
'use server';

import { sendEmail } from '@/lib/emailService';
import type { AdminMessage } from '@/data/constants'; // Keep this for potential future direct DB save

const adminEmail = process.env.ADMIN_EMAIL;
const siteName = "Atif's Universe";

interface InquiryData {
  name: string;
  email: string;
  message: string;
  type: 'General Contact' | 'Project Service Inquiry';
  projectTitle?: string;
  clientProjectIdea?: string;
  aiGeneratedIdeas?: string | null;
}

interface SendInquiryEmailsResult {
  success: boolean;
  error?: string; // For critical errors shown to user
  adminEmailFailed?: boolean;
  adminEmailError?: string;
  originalInquiryData?: InquiryData; // To reconstruct message if admin email fails
}

export async function sendInquiryEmails(data: InquiryData): Promise<SendInquiryEmailsResult> {
  if (!adminEmail) {
    console.error('CRITICAL: ADMIN_EMAIL environment variable is not set. Cannot send admin notification.');
    // This is a configuration error that should ideally be caught, but for client, let user email proceed if possible.
    // However, if admin email is critical, this might be a point to return actual failure.
    // For now, let's allow user confirmation to proceed if their email is valid.
  }

  // 1. Email to User (Confirmation)
  let userSubject: string;
  let userHtmlBody: string;
  let userTextBody: string;

  if (data.type === 'Project Service Inquiry') {
    userSubject = `Inquiry Received: ${data.projectTitle || 'Your Project Idea'} - ${siteName}`;
    userHtmlBody = `
      <p>Hello ${data.name},</p>
      <p>Thank you for your interest in ${siteName}. We have received your inquiry regarding "${data.projectTitle || 'our services'}".</p>
      ${data.clientProjectIdea ? `<p><strong>Your described idea/requirements:</strong><br/>${data.clientProjectIdea.replace(/\n/g, '<br/>')}</p>` : ''}
      <p>We will review your details and get back to you as soon as possible.</p>
      <p>Best regards,<br/>The ${siteName} Team</p>
    `;
    userTextBody = `
Hello ${data.name},

Thank you for your interest in ${siteName}. We have received your inquiry regarding "${data.projectTitle || 'our services'}".
${data.clientProjectIdea ? `\nYour described idea/requirements:\n${data.clientProjectIdea}\n` : ''}
We will review your details and get back to you as soon as possible.

Best regards,
The ${siteName} Team
    `;
  } else { // General Contact
    userSubject = `Message Received - ${siteName}`;
    userHtmlBody = `
      <p>Hello ${data.name},</p>
      <p>Thank you for reaching out to ${siteName}. We have received your message and will get back to you as soon as possible.</p>
      <p>Your message: <br/>${data.message.replace(/\n/g, '<br/>')}</p>
      <p>Best regards,<br/>The ${siteName} Team</p>
    `;
    userTextBody = `
Hello ${data.name},

Thank you for reaching out to ${siteName}. We have received your message and will get back to you as soon as possible.

Your message:
${data.message}

Best regards,
The ${siteName} Team
    `;
  }
  
  const userEmailResult = await sendEmail({
    to: data.email,
    subject: userSubject,
    html: `<html><body>${userHtmlBody}</body></html>`,
    text: userTextBody.trim(),
  });

  if (!userEmailResult.success) {
    console.error('Failed to send confirmation email to user:', userEmailResult.error);
    // Log error but still attempt to send admin email and return "success" for the client submission part
  }

  // 2. Email to Admin (Notification)
  // Only proceed if adminEmail is configured
  if (!adminEmail) {
    console.error("Admin email not configured. Skipping admin notification.");
    // Return success for client, but indicate admin email was not even attempted (implicitly failed due to config)
    return { success: true, adminEmailFailed: true, adminEmailError: "Admin email not configured on server.", originalInquiryData: data };
  }

  const adminSubject = `New ${data.type}: ${data.name} (${data.projectTitle || 'General Inquiry'}) - ${siteName}`;
  let adminContentHtml = '';
  let adminContentText = '';

  if (data.type === 'Project Service Inquiry') {
    adminContentHtml = `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      <p><strong>Regarding Project:</strong> ${data.projectTitle || 'N/A'}</p>
      <p><strong>Client's Project Idea/Requirements:</strong></p>
      <p style="padding-left: 10px; border-left: 2px solid #eeeeee; margin-left: 5px;">${(data.clientProjectIdea || data.message).replace(/\n/g, '<br/>')}</p>
      ${data.aiGeneratedIdeas ? `<p><strong>AI Suggested Ideas (for reference):</strong></p><p style="padding-left: 10px; border-left: 2px solid #eeeeee; margin-left: 5px;">${data.aiGeneratedIdeas.replace(/\n/g, '<br/>')}</p>` : ''}
    `;
    adminContentText = `
Name: ${data.name}
Email: ${data.email}
Regarding Project: ${data.projectTitle || 'N/A'}
Client's Project Idea/Requirements:
${(data.clientProjectIdea || data.message)}
${data.aiGeneratedIdeas ? `\nAI Suggested Ideas (for reference):\n${data.aiGeneratedIdeas}\n` : ''}
    `;
  } else { // General Contact
     adminContentHtml = `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      <p><strong>Message:</strong></p>
      <p style="padding-left: 10px; border-left: 2px solid #eeeeee; margin-left: 5px;">${data.message.replace(/\n/g, '<br/>')}</p>
    `;
    adminContentText = `
Name: ${data.name}
Email: ${data.email}
Message:
${data.message}
    `;
  }

  const adminHtml = `
    <html><body>
      <p>You have received a new ${data.type.toLowerCase()} via the ${siteName} website:</p>
      <hr/>
      ${adminContentHtml}
      <hr/>
      <p>Please follow up with them at your earliest convenience.</p>
    </body></html>
  `;
  const adminText = `
You have received a new ${data.type.toLowerCase()} via the ${siteName} website:
--------------------------------------------------
${adminContentText.trim()}
--------------------------------------------------
Please follow up with them at your earliest convenience.
  `;

  const adminEmailResult = await sendEmail({
    to: adminEmail,
    subject: adminSubject,
    html: adminHtml,
    text: adminText.trim(),
  });

  if (!adminEmailResult.success) {
    console.error('Failed to send notification email to admin:', adminEmailResult.error);
    // Return success for client, but flag that admin email failed.
    return { success: true, adminEmailFailed: true, adminEmailError: typeof adminEmailResult.error === 'string' ? adminEmailResult.error : JSON.stringify(adminEmailResult.error), originalInquiryData: data };
  }

  // If we reach here, both user (attempted) and admin emails (attempted and succeeded if configured) are processed.
  return { success: true };
}
