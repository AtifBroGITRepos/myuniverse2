
'use server';

import { sendEmail } from '@/lib/emailService';
import type { AdminMessage } from '@/data/constants'; 

const adminEmail = process.env.ADMIN_EMAIL;
const systemAlertEmailsEnv = process.env.SYSTEM_ALERT_EMAILS; // Comma-separated list
const siteName = "Atif's Universe"; 
const currentYear = new Date().getFullYear();

interface InquiryData {
  name: string;
  email: string;
  message: string;
  type: 'General Contact' | 'Project Service Inquiry';
  projectTitle?: string;
  clientProjectIdea?: string;
  aiGeneratedIdeas?: string | null;
  messageSummary?: string | null; 
}

interface SendInquiryEmailsResult {
  success: boolean;
  error?: string; 
  adminEmailFailed?: boolean;
  adminEmailError?: string;
  originalInquiryData?: InquiryData; 
}

const nl2br = (str: string | undefined | null) => {
  if (!str) return '';
  return str.replace(/(\r\n|\n\r|\r|\n)/g, '<br/>');
};

const htmlToText = (html: string) => {
  return html
    .replace(/<style([\s\S]*?)<\/style>/gi, '')
    .replace(/<script([\s\S]*?)<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n--------------------------------------------------\n')
    .replace(/<[^>]+>/gi, '')
    .replace(/\n\s*\n/g, '\n\n') 
    .trim();
};


export async function sendInquiryEmails(data: InquiryData): Promise<SendInquiryEmailsResult> {
  if (!adminEmail) {
    console.error('CRITICAL: ADMIN_EMAIL environment variable is not set. Cannot send primary admin notification.');
  }

  const userName = data.name;
  const userEmail = data.email;
  const projectTitleForEmail = data.projectTitle || 'our services';

  let aiGeneratedSummaryHTML = '';
  if (data.messageSummary) {
    aiGeneratedSummaryHTML = `
        <p style="font-size: 16px; color: #333333; margin-top: 15px;"><strong>AI Summary of Your Message:</strong></p>
        <div style="font-size: 15px; color: #555555; padding: 10px; border-left: 3px solid #10B981; background-color: #f0fdf4;">
          ${nl2br(data.messageSummary)}
        </div>`;
  }
  
   let aiSuggestedProjectIdeasHTML = '';
   if (data.type === 'Project Service Inquiry' && data.aiGeneratedIdeas) {
      aiSuggestedProjectIdeasHTML = `
        <p style="font-size: 16px; color: #333333; margin-top: 15px;"><strong>AI Suggested Ideas (for reference):</strong></p>
        <div style="font-size: 15px; color: #555555; padding: 10px; border-left: 3px solid #39FF14; background-color: #f9f9f9; white-space: pre-wrap;">
          ${nl2br(data.aiGeneratedIdeas)}
        </div>`;
   }

  let userSubject: string;
  let userHtmlTemplate: string;

  if (data.type === 'Project Service Inquiry') {
    userSubject = `Inquiry Received: ${data.projectTitle || 'Your Project Idea'} - ${siteName}`;
    const clientProjectIdeaHTML = data.clientProjectIdea 
      ? `
        <p style="font-size: 16px; color: #333333; margin-top: 20px;"><strong>Your described idea/requirements:</strong></p>
        <div style="font-size: 15px; color: #555555; padding: 10px; border-left: 3px solid #39FF14; background-color: #f9f9f9;">
          ${nl2br(data.clientProjectIdea)}
        </div>`
      : '';

    userHtmlTemplate = `
<html>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #0D0D0D; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="color: #39FF14; margin: 0; font-size: 24px;">{{siteName}}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px 20px;">
        <p style="font-size: 16px; color: #333333;">Hello {{userName}},</p>
        <p style="font-size: 16px; color: #333333;">Thank you for your interest in {{siteName}}. We have received your inquiry regarding "<strong>{{projectTitleForEmail}}</strong>".</p>
        ${clientProjectIdeaHTML}
        {{aiGeneratedSummaryHTML}}
        <p style="font-size: 16px; color: #333333; margin-top: 20px;">We will review your details and get back to you as soon as possible.</p>
        <p style="font-size: 16px; color: #333333; margin-top: 30px;">Best regards,<br/>The {{siteName}} Team</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee;">
        &copy; {{currentYear}} {{siteName}}. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>`;

  } else { 
    userSubject = `Message Received - ${siteName}`;
    userHtmlTemplate = `
<html>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #0D0D0D; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="color: #39FF14; margin: 0; font-size: 24px;">{{siteName}}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px 20px;">
        <p style="font-size: 16px; color: #333333;">Hello {{userName}},</p>
        <p style="font-size: 16px; color: #333333;">Thank you for reaching out to {{siteName}}. We have received your message and will get back to you as soon as possible.</p>
        <p style="font-size: 16px; color: #333333; margin-top: 20px;"><strong>Your message:</strong></p>
        <div style="font-size: 15px; color: #555555; padding: 10px; border-left: 3px solid #39FF14; background-color: #f9f9f9;">
          ${nl2br(data.message)}
        </div>
        {{aiGeneratedSummaryHTML}}
        <p style="font-size: 16px; color: #333333; margin-top: 30px;">Best regards,<br/>The {{siteName}} Team</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee;">
        &copy; {{currentYear}} {{siteName}}. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  let finalUserHtmlBody = userHtmlTemplate
    .replace(/{{siteName}}/g, siteName)
    .replace(/{{userName}}/g, userName)
    .replace(/{{projectTitleForEmail}}/g, projectTitleForEmail) 
    .replace(/{{currentYear}}/g, currentYear.toString())
    .replace('{{aiGeneratedSummaryHTML}}', aiGeneratedSummaryHTML); 
  
  const userEmailResult = await sendEmail({
    to: data.email,
    subject: userSubject,
    html: finalUserHtmlBody,
    text: htmlToText(finalUserHtmlBody),
  });

  if (!userEmailResult.success) {
    console.error('Failed to send confirmation email to user:', userEmailResult.error);
  }

  let adminEmailResult = { success: true, error: undefined as (string | undefined) };
  if (adminEmail) {
    const adminSubject = `New ${data.type}: ${userName} (${data.projectTitle || 'General Inquiry'}) - ${siteName}`;
    let adminHtmlTemplate: string;

    if (data.type === 'Project Service Inquiry') {
      adminHtmlTemplate = `
<html>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #0D0D0D; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="color: #39FF14; margin: 0; font-size: 24px;">New Project Inquiry - {{siteName}}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px 20px;">
        <p style="font-size: 16px; color: #333333;">You have received a new project service inquiry via the {{siteName}} website:</p>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
        <p style="font-size: 16px; color: #333333;"><strong>Name:</strong> {{userName}}</p>
        <p style="font-size: 16px; color: #333333;"><strong>Email:</strong> <a href="mailto:{{userEmail}}" style="color: #39FF14; text-decoration: none;">{{userEmail}}</a></p>
        <p style="font-size: 16px; color: #333333;"><strong>Regarding Project:</strong> {{projectTitleForEmail}}</p>
        <p style="font-size: 16px; color: #333333; margin-top: 15px;"><strong>Client's Project Idea/Requirements:</strong></p>
        <div style="font-size: 15px; color: #555555; padding: 10px; border-left: 3px solid #39FF14; background-color: #f9f9f9; white-space: pre-wrap;">
          ${nl2br(data.clientProjectIdea || data.message)}
        </div>
        {{aiGeneratedSummaryHTML}}
        {{aiSuggestedProjectIdeasHTML}}
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
        <p style="font-size: 16px; color: #333333;">Please follow up with them at your earliest convenience.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee;">
         This is an automated notification from {{siteName}}.
      </td>
    </tr>
  </table>
</body>
</html>`;
      adminHtmlTemplate = adminHtmlTemplate
          .replace('{{aiSuggestedProjectIdeasHTML}}', aiSuggestedProjectIdeasHTML);
    } else { 
       adminHtmlTemplate = `
<html>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #0D0D0D; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="color: #39FF14; margin: 0; font-size: 24px;">New Inquiry - {{siteName}}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px 20px;">
        <p style="font-size: 16px; color: #333333;">You have received a new general contact via the {{siteName}} website:</p>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
        <p style="font-size: 16px; color: #333333;"><strong>Name:</strong> {{userName}}</p>
        <p style="font-size: 16px; color: #333333;"><strong>Email:</strong> <a href="mailto:{{userEmail}}" style="color: #39FF14; text-decoration: none;">{{userEmail}}</a></p>
        <p style="font-size: 16px; color: #333333; margin-top: 15px;"><strong>Message:</strong></p>
        <div style="font-size: 15px; color: #555555; padding: 10px; border-left: 3px solid #39FF14; background-color: #f9f9f9; white-space: pre-wrap;">
          ${nl2br(data.message)}
        </div>
        {{aiGeneratedSummaryHTML}}
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
        <p style="font-size: 16px; color: #333333;">Please follow up with them at your earliest convenience.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee;">
        This is an automated notification from {{siteName}}.
      </td>
    </tr>
  </table>
</body>
</html>`;
    }
  
    let finalAdminHtmlBody = adminHtmlTemplate
      .replace(/{{siteName}}/g, siteName)
      .replace(/{{userName}}/g, userName)
      .replace(/{{userEmail}}/g, userEmail)
      .replace(/{{projectTitleForEmail}}/g, projectTitleForEmail)
      .replace('{{aiGeneratedSummaryHTML}}', aiGeneratedSummaryHTML.replace("AI Summary of Your Message:", "AI Summary of User's Message:")); 

    adminEmailResult = await sendEmail({
      to: adminEmail,
      subject: adminSubject,
      html: finalAdminHtmlBody,
      text: htmlToText(finalAdminHtmlBody),
    });

    if (!adminEmailResult.success) {
      console.error('Failed to send notification email to primary admin:', adminEmail, 'Error:', adminEmailResult.error);
      
      // Send system alert emails if primary admin notification failed
      if (systemAlertEmailsEnv) {
        const alertEmailList = systemAlertEmailsEnv.split(',').map(email => email.trim()).filter(email => email);
        if (alertEmailList.length > 0) {
          const alertSubject = `System Alert: Admin Email Notification Failure for ${siteName}`;
          const alertMessage = `
            <p><strong>ALERT:</strong> Failed to send the primary admin notification for a new inquiry.</p>
            <p><strong>Original Inquiry Details:</strong></p>
            <ul>
              <li><strong>Type:</strong> ${data.type}</li>
              <li><strong>From:</strong> ${data.name} (${data.email})</li>
              ${data.projectTitle ? `<li><strong>Project:</strong> ${data.projectTitle}</li>` : ''}
              <li><strong>User's Message/Idea:</strong><br/>${nl2br(data.type === 'Project Service Inquiry' ? data.clientProjectIdea : data.message)}</li>
              ${data.messageSummary ? `<li><strong>AI Summary of User's Message:</strong><br/>${nl2br(data.messageSummary)}</li>` : ''}
              ${data.type === 'Project Service Inquiry' && data.aiGeneratedIdeas ? `<li><strong>AI Suggested Ideas (for ref):</strong><br/>${nl2br(data.aiGeneratedIdeas)}</li>` : ''}
            </ul>
            <p><strong>Error sending to primary admin (${adminEmail}):</strong> ${adminEmailResult.error || 'Unknown error'}</p>
            <p>Please check the system and email configurations.</p>
          `;
          const alertHtmlBody = `<html><body>${alertMessage}</body></html>`;

          for (const alertToEmail of alertEmailList) {
            try {
              await sendEmail({
                to: alertToEmail,
                subject: alertSubject,
                html: alertHtmlBody,
                text: htmlToText(alertHtmlBody)
              });
              console.log(`System alert email sent successfully to ${alertToEmail}`);
            } catch (alertSendError) {
              console.error(`Failed to send system alert email to ${alertToEmail}:`, alertSendError);
            }
          }
        }
      }

      return { 
          success: userEmailResult.success, 
          adminEmailFailed: true, 
          adminEmailError: typeof adminEmailResult.error === 'string' ? adminEmailResult.error : JSON.stringify(adminEmailResult.error), 
          originalInquiryData: data 
      };
    }
  } else {
     return { success: true, adminEmailFailed: true, adminEmailError: "Admin email not configured on server.", originalInquiryData: data };
  }

  return { success: true };
}
      
