
'use server';
/**
 * @fileOverview An AI agent to generate content for a single service item.
 *
 * - generateServiceItem - A function that generates a title and description for a service.
 * - GenerateServiceItemInput - The input type for the generateServiceItem function.
 * - GenerateServiceItemOutput - The return type for the generateServiceItem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateServiceItemInputSchema = z.object({
  serviceFocus: z.string().describe('The core area of the service (e.g., "Web Development", "AI Integration", "Graphic Design").'),
  targetAudience: z.string().optional().describe('The primary audience for this service (e.g., "Startups", "Small Businesses", "Enterprises").'),
  keyBenefits: z.array(z.string()).optional().describe('A list of 2-3 key benefits the service provides.'),
  tone: z.enum(['professional', 'creative', 'technical', 'approachable']).default('professional').describe('The desired tone for the service description.'),
});
export type GenerateServiceItemInput = z.infer<typeof GenerateServiceItemInputSchema>;

const GenerateServiceItemOutputSchema = z.object({
  title: z.string().describe('A concise and clear title for the service item. Should reflect the serviceFocus.'),
  description: z.string().describe('An engaging 1-2 sentence description of the service, highlighting its value and benefits.'),
});
export type GenerateServiceItemOutput = z.infer<typeof GenerateServiceItemOutputSchema>;

export async function generateServiceItem(input: GenerateServiceItemInput): Promise<GenerateServiceItemOutput> {
  return generateServiceItemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateServiceItemPrompt',
  input: {schema: GenerateServiceItemInputSchema},
  output: {schema: GenerateServiceItemOutputSchema},
  prompt: `You are an AI assistant helping to craft content for a service item in a portfolio.
The service focus is: "{{serviceFocus}}".
The desired tone is: {{tone}}.

{{#if targetAudience}}
The target audience is: {{targetAudience}}.
{{/if}}

{{#if keyBenefits.length}}
Key benefits to highlight include:
{{#each keyBenefits}}
- {{{this}}}
{{/each}}
{{/if}}

Generate a concise title for this service that clearly reflects "{{serviceFocus}}".
Then, write a short (1-2 sentences) and impactful description. The description should be engaging, use the specified tone, and subtly incorporate the target audience or key benefits if provided.
The goal is to clearly communicate what the service is and the value it provides.
For example, if serviceFocus is "Web Development", title could be "Custom Web Solutions" and description could be "Building responsive and scalable web applications tailored to your business needs, from front-end to back-end."
`,
});

const generateServiceItemFlow = ai.defineFlow(
  {
    name: 'generateServiceItemFlow',
    inputSchema: GenerateServiceItemInputSchema,
    outputSchema: GenerateServiceItemOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
