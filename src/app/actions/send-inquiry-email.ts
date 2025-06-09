
'use server';

import { sendEmail } from '@/lib/emailService';
import type { AdminMessage } from '@/data/constants'; // Assuming this type exists

const adminEmail = process.env.ADMIN_EMAIL;
const siteName = "Atif's Universe"; // Or dynamically get from somewhere

interface InquiryData {
  name: string;
  email: string;
  message: string;
  type: 'General Contact' | 'Project Service Inquiry';
  projectTitle?: string; // Only for project service inquiries
  clientProjectIdea?: string; // Only for project service inquiries
  aiGeneratedIdeas?: string | null; // Only for project service inquiries
}

export async function sendInquiryEmails(data: InquiryData): Promise<{ success: boolean; error?: string }> {
  if (!adminEmail) {
    console.error('ADMIN_EMAIL environment variable is not set.');
    return { success: false, error: 'Server configuration error: Admin email not set.' };
  }

  // 1. Email to User (Confirmation)
  const userSubject = `Thank you for your inquiry - ${siteName}`;
  const userHtml = `
    <p>Hello ${data.name},</p>
    <p>Thank you for reaching out to ${siteName}. We have received your ${data.type.toLowerCase()} and will get back to you as soon as possible.</p>
    ${data.type === 'Project Service Inquiry' && data.projectTitle ? `<p><strong>Regarding Project:</strong> ${data.projectTitle}</p>` : ''}
    <p>Best regards,<br/>The ${siteName} Team</p>
  `;
  const userEmailResult = await sendEmail({
    to: data.email,
    subject: userSubject,
    html: userHtml,
  });

  if (!userEmailResult.success) {
    // Log error but still attempt to send admin email
    console.error('Failed to send confirmation email to user:', userEmailResult.error);
  }

  // 2. Email to Admin (Notification)
  const adminSubject = `New ${data.type} from ${data.name} - ${siteName}`;
  let adminHtml = `
    <p>You have received a new ${data.type.toLowerCase()} via the ${siteName} website:</p>
    <ul>
      <li><strong>Name:</strong> ${data.name}</li>
      <li><strong>Email:</strong> ${data.email}</li>
      ${data.type === 'Project Service Inquiry' && data.projectTitle ? `<li><strong>Regarding Project:</strong> ${data.projectTitle}</li>` : ''}
      ${data.clientProjectIdea ? `<li><strong>Client's Project Idea/Requirements:</strong><br/>${data.clientProjectIdea.replace(/\n/g, '<br/>')}</li>` : ''}
      ${data.aiGeneratedIdeas ? `<li><strong>AI Suggested Ideas (for reference):</strong><br/>${data.aiGeneratedIdeas.replace(/\n/g, '<br/>')}</li>` : ''}
      ${data.type === 'General Contact' ? `<li><strong>Message:</strong><br/>${data.message.replace(/\n/g, '<br/>')}</li>` : ''}
    </ul>
    <p>Please follow up with them at your earliest convenience.</p>
  `;
  
  // If it's a project service inquiry, the main message content is combined
  if (data.type === 'Project Service Inquiry') {
     adminHtml = `
      <p>You have received a new ${data.type.toLowerCase()} via the ${siteName} website:</p>
      <ul>
        <li><strong>Name:</strong> ${data.name}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Regarding Project:</strong> ${data.projectTitle || 'N/A'}</li>
        <li><strong>Client's Project Idea/Requirements:</strong><br/>${(data.clientProjectIdea || data.message).replace(/\n/g, '<br/>')}</li>
        ${data.aiGeneratedIdeas ? `<li><strong>AI Suggested Ideas (for reference):</strong><br/>${data.aiGeneratedIdeas.replace(/\n/g, '<br/>')}</li>` : ''}
      </ul>
      <p>Please follow up with them at your earliest convenience.</p>
    `;
  }


  const adminEmailResult = await sendEmail({
    to: adminEmail,
    subject: adminSubject,
    html: adminHtml,
  });

  if (!adminEmailResult.success) {
    console.error('Failed to send notification email to admin:', adminEmailResult.error);
    return { success: false, error: 'Failed to send admin notification email.' };
  }

  return { success: true };
}
