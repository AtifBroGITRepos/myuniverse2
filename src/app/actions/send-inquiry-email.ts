
'use server';

import { sendEmail } from '@/lib/emailService';
import type { AdminMessage } from '@/data/constants'; // Keep this for potential future direct DB save

const adminEmail = process.env.ADMIN_EMAIL;
const siteName = "Atif's Universe"; // Consider making this an env variable if it changes often
const currentYear = new Date().getFullYear();

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
  error?: string; 
  adminEmailFailed?: boolean;
  adminEmailError?: string;
  originalInquiryData?: InquiryData; 
}

// Helper to convert newline characters to <br/> for HTML emails
const nl2br = (str: string | undefined | null) => {
  if (!str) return '';
  return str.replace(/(\r\n|\n\r|\r|\n)/g, '<br/>');
};

// Helper to generate a basic plain text version from HTML
const htmlToText = (html: string) => {
  return html
    .replace(/<style([\s\S]*?)<\/style>/gi, '')
    .replace(/<script([\s\S]*?)<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n--------------------------------------------------\n')
    .replace(/<[^>]+>/gi, '')
    .replace(/\n\s*\n/g, '\n\n') // Replace multiple newlines with a double newline
    .trim();
};


export async function sendInquiryEmails(data: InquiryData): Promise<SendInquiryEmailsResult> {
  if (!adminEmail) {
    console.error('CRITICAL: ADMIN_EMAIL environment variable is not set. Cannot send admin notification.');
  }

  // Common variables
  const userName = data.name;
  const userEmail = data.email;
  const projectTitleForEmail = data.projectTitle || 'our services';

  // 1. Email to User (Confirmation)
  let userSubject: string;
  let userHtmlBody: string;

  if (data.type === 'Project Service Inquiry') {
    userSubject = `Inquiry Received: ${data.projectTitle || 'Your Project Idea'} - ${siteName}`;
    const clientProjectIdeaHTML = data.clientProjectIdea 
      ? `
        <p style="font-size: 16px; color: #333333; margin-top: 20px;"><strong>Your described idea/requirements:</strong></p>
        <div style="font-size: 15px; color: #555555; padding: 10px; border-left: 3px solid #39FF14; background-color: #f9f9f9;">
          ${nl2br(data.clientProjectIdea)}
        </div>`
      : '';

    userHtmlBody = `
<html>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #0D0D0D; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="color: #39FF14; margin: 0; font-size: 24px;">${siteName}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px 20px;">
        <p style="font-size: 16px; color: #333333;">Hello ${userName},</p>
        <p style="font-size: 16px; color: #333333;">Thank you for your interest in ${siteName}. We have received your inquiry regarding "<strong>${projectTitleForEmail}</strong>".</p>
        ${clientProjectIdeaHTML}
        <p style="font-size: 16px; color: #333333; margin-top: 20px;">We will review your details and get back to you as soon as possible.</p>
        <p style="font-size: 16px; color: #333333; margin-top: 30px;">Best regards,<br/>The ${siteName} Team</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee;">
        &copy; ${currentYear} ${siteName}. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>`;
  } else { // General Contact
    userSubject = `Message Received - ${siteName}`;
    userHtmlBody = `
<html>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #0D0D0D; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="color: #39FF14; margin: 0; font-size: 24px;">${siteName}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px 20px;">
        <p style="font-size: 16px; color: #333333;">Hello ${userName},</p>
        <p style="font-size: 16px; color: #333333;">Thank you for reaching out to ${siteName}. We have received your message and will get back to you as soon as possible.</p>
        <p style="font-size: 16px; color: #333333; margin-top: 20px;"><strong>Your message:</strong></p>
        <div style="font-size: 15px; color: #555555; padding: 10px; border-left: 3px solid #39FF14; background-color: #f9f9f9;">
          ${nl2br(data.message)}
        </div>
        <p style="font-size: 16px; color: #333333; margin-top: 30px;">Best regards,<br/>The ${siteName} Team</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee;">
        &copy; ${currentYear} ${siteName}. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>`;
  }
  
  const userEmailResult = await sendEmail({
    to: data.email,
    subject: userSubject,
    html: userHtmlBody,
    text: htmlToText(userHtmlBody),
  });

  if (!userEmailResult.success) {
    console.error('Failed to send confirmation email to user:', userEmailResult.error);
  }

  // 2. Email to Admin (Notification)
  if (!adminEmail) {
    console.error("Admin email not configured. Skipping admin notification.");
    return { success: true, adminEmailFailed: true, adminEmailError: "Admin email not configured on server.", originalInquiryData: data };
  }

  const adminSubject = `New ${data.type}: ${userName} (${data.projectTitle || 'General Inquiry'}) - ${siteName}`;
  let adminHtmlBody: string;

  if (data.type === 'Project Service Inquiry') {
    const aiGeneratedIdeasHTML = data.aiGeneratedIdeas
      ? `
        <p style="font-size: 16px; color: #333333; margin-top: 15px;"><strong>AI Suggested Ideas (for reference):</strong></p>
        <div style="font-size: 15px; color: #555555; padding: 10px; border-left: 3px solid #39FF14; background-color: #f9f9f9; white-space: pre-wrap;">
          ${nl2br(data.aiGeneratedIdeas)}
        </div>`
      : '';

    adminHtmlBody = `
<html>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #0D0D0D; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="color: #39FF14; margin: 0; font-size: 24px;">New Project Inquiry - ${siteName}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px 20px;">
        <p style="font-size: 16px; color: #333333;">You have received a new ${data.type.toLowerCase()} via the ${siteName} website:</p>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
        <p style="font-size: 16px; color: #333333;"><strong>Name:</strong> ${userName}</p>
        <p style="font-size: 16px; color: #333333;"><strong>Email:</strong> <a href="mailto:${userEmail}" style="color: #39FF14; text-decoration: none;">${userEmail}</a></p>
        <p style="font-size: 16px; color: #333333;"><strong>Regarding Project:</strong> ${projectTitleForEmail}</p>
        <p style="font-size: 16px; color: #333333; margin-top: 15px;"><strong>Client's Project Idea/Requirements:</strong></p>
        <div style="font-size: 15px; color: #555555; padding: 10px; border-left: 3px solid #39FF14; background-color: #f9f9f9; white-space: pre-wrap;">
          ${nl2br(data.clientProjectIdea || data.message)}
        </div>
        ${aiGeneratedIdeasHTML}
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
        <p style="font-size: 16px; color: #333333;">Please follow up with them at your earliest convenience.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee;">
         This is an automated notification from ${siteName}.
      </td>
    </tr>
  </table>
</body>
</html>`;
  } else { // General Contact
     adminHtmlBody = `
<html>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #0D0D0D; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="color: #39FF14; margin: 0; font-size: 24px;">New Inquiry - ${siteName}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px 20px;">
        <p style="font-size: 16px; color: #333333;">You have received a new ${data.type.toLowerCase()} via the ${siteName} website:</p>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
        <p style="font-size: 16px; color: #333333;"><strong>Name:</strong> ${userName}</p>
        <p style="font-size: 16px; color: #333333;"><strong>Email:</strong> <a href="mailto:${userEmail}" style="color: #39FF14; text-decoration: none;">${userEmail}</a></p>
        <p style="font-size: 16px; color: #333333; margin-top: 15px;"><strong>Message:</strong></p>
        <div style="font-size: 15px; color: #555555; padding: 10px; border-left: 3px solid #39FF14; background-color: #f9f9f9; white-space: pre-wrap;">
          ${nl2br(data.message)}
        </div>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
        <p style="font-size: 16px; color: #333333;">Please follow up with them at your earliest convenience.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee;">
        This is an automated notification from ${siteName}.
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  const adminEmailResult = await sendEmail({
    to: adminEmail,
    subject: adminSubject,
    html: adminHtmlBody,
    text: htmlToText(adminHtmlBody),
  });

  if (!adminEmailResult.success) {
    console.error('Failed to send notification email to admin:', adminEmailResult.error);
    return { success: true, adminEmailFailed: true, adminEmailError: typeof adminEmailResult.error === 'string' ? adminEmailResult.error : JSON.stringify(adminEmailResult.error), originalInquiryData: data };
  }

  return { success: true };
}
