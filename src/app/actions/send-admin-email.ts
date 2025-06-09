
'use server';

import { sendEmail } from '@/lib/emailService';

interface AdminEmailData {
  to: string;
  subject: string;
  htmlBody: string;
}

export async function sendAdminComposedEmail(data: AdminEmailData): Promise<{ success: boolean; error?: string }> {
  const emailFrom = process.env.EMAIL_FROM;

  if (!emailFrom) {
    console.error('EMAIL_FROM environment variable is not set. Cannot send admin composed email.');
    return { success: false, error: 'Server configuration error: Email sender address not set.' };
  }
  
  // Basic validation
  if (!data.to || !data.subject || !data.htmlBody) {
    return { success: false, error: 'Missing required fields: To, Subject, or Body.' };
  }

  try {
    const emailResult = await sendEmail({
      to: data.to,
      subject: data.subject,
      html: `<html><body>${data.htmlBody}</body></html>`, // Basic HTML wrapper
      text: data.htmlBody.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>?/gm, ''), // Simple text conversion
    });

    if (!emailResult.success) {
      console.error('Failed to send admin composed email:', emailResult.error);
      return { success: false, error: 'Failed to send email via provider.' };
    }

    return { success: true };

  } catch (error: any) {
    console.error('Exception in sendAdminComposedEmail:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while sending the email.' };
  }
}
