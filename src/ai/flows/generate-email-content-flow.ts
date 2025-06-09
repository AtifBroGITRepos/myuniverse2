
'use server';
/**
 * @fileOverview An AI agent to generate or refine email content.
 *
 * - generateEmailContent - A function that generates email body text.
 * - GenerateEmailContentInput - The input type for the generateEmailContent function.
 * - GenerateEmailContentOutput - The return type for the generateEmailContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmailContentInputSchema = z.object({
  userPrompt: z.string().describe('The core message or points the admin wants to convey in the email.'),
  tone: z.enum(['professional', 'friendly', 'concise', 'persuasive', 'formal', 'informal']).default('professional').describe('The desired tone of the email.'),
  recipientContext: z.string().optional().describe('Brief context about the recipient or purpose (e.g., "Replying to a project inquiry", "Follow-up email", "Announcement to client").'),
  lengthHint: z.enum(['short', 'medium', 'long']).default('medium').describe('A hint for the desired length of the email body.'),
});
export type GenerateEmailContentInput = z.infer<typeof GenerateEmailContentInputSchema>;

const GenerateEmailContentOutputSchema = z.object({
  suggestedHtmlBody: z
    .string()
    .describe('The AI-generated email body, formatted as simple HTML (e.g., using <p>, <br>, <strong>). Should not include <html>, <head>, or <body> tags.'),
});
export type GenerateEmailContentOutput = z.infer<typeof GenerateEmailContentOutputSchema>;

export async function generateEmailContent(input: GenerateEmailContentInput): Promise<GenerateEmailContentOutput> {
  return generateEmailContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailContentPrompt',
  input: {schema: GenerateEmailContentInputSchema},
  output: {schema: GenerateEmailContentOutputSchema},
  prompt: `You are an expert email copywriter assisting an administrator in drafting an email.

The administrator wants to convey the following core message:
"{{{userPrompt}}}"

The desired tone for this email is: {{tone}}.
{{#if recipientContext}}
The context for this email or recipient is: "{{recipientContext}}".
{{/if}}
The desired length is approximately: {{lengthHint}}.

Generate a suitable email body.
Format the output as simple HTML, using tags like <p>, <br/>, <strong>, <em>, <ul>, <li>.
Do NOT include <html>, <head>, or <body> tags. Only provide the content that would go inside the <body>.
Ensure paragraphs are wrapped in <p> tags and use <br/> for line breaks within paragraphs if necessary.
For example:
<p>Dear recipient,</p><p>This is the first paragraph with <strong>important</strong> text.</p><p>This is the second paragraph.<br/>It has a line break.</p><p>Regards,<br/>Admin</p>
`,
});

const generateEmailContentFlow = ai.defineFlow(
  {
    name: 'generateEmailContentFlow',
    inputSchema: GenerateEmailContentInputSchema,
    outputSchema: GenerateEmailContentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI model failed to generate email content.");
    }
    // Ensure the output is just the HTML body, sometimes models add extra boilerplate
    let htmlBody = output.suggestedHtmlBody;
    // Basic cleanup if model wraps with ```html ... ```
    if (htmlBody.startsWith('```html')) {
      htmlBody = htmlBody.substring(7);
      if (htmlBody.endsWith('```')) {
        htmlBody = htmlBody.substring(0, htmlBody.length - 3);
      }
    }
    htmlBody = htmlBody.trim();
    
    return { suggestedHtmlBody: htmlBody };
  }
);
