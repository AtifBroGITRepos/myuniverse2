
'use server';

/**
 * @fileOverview An AI agent to suggest project ideas based on Atif's portfolio and expertise,
 * optionally contextualized by a specific project or service type.
 *
 * - suggestProjectIdeas - A function that suggests project ideas.
 * - SuggestProjectIdeasInput - The input type for the suggestProjectIdeas function.
 * - SuggestProjectIdeasOutput - The return type for the suggestProjectIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProjectIdeasInputSchema = z.object({
  businessNeeds: z
    .string()
    .describe('Description of the potential client\'s business needs or initial project idea.'),
  atifPortfolio: z
    .string()
    .describe('Description of Atif\'s portfolio and expertise.'),
  projectContext: z
    .string()
    .optional()
    .describe('Optional. The specific project title or service type the user is inquiring about (e.g., "E-commerce Platform X", "Data Analytics Dashboard").'),
});
export type SuggestProjectIdeasInput = z.infer<typeof SuggestProjectIdeasInputSchema>;

const SuggestProjectIdeasOutputSchema = z.object({
  projectIdeas: z
    .string()
    .describe('A list of project ideas tailored to the client\'s business needs, considering Atif\'s portfolio and any provided project context. Formatted as a simple list or bullet points.'),
});
export type SuggestProjectIdeasOutput = z.infer<typeof SuggestProjectIdeasOutputSchema>;

export async function suggestProjectIdeas(input: SuggestProjectIdeasInput): Promise<SuggestProjectIdeasOutput> {
  return suggestProjectIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProjectIdeasPrompt',
  input: {schema: SuggestProjectIdeasInputSchema},
  output: {schema: SuggestProjectIdeasOutputSchema},
  prompt: `You are an AI assistant helping a potential client brainstorm project ideas based on Atif's skills and portfolio.

Atif's Portfolio Summary:
{{{atifPortfolio}}}

Client's Stated Business Needs / Initial Idea:
{{{businessNeeds}}}

{{#if projectContext}}
The client is expressing interest in a service or project related to: "{{{projectContext}}}".
Keep this context in mind when generating ideas.
{{/if}}

Based on the client's needs, Atif's portfolio, and the project context (if provided):
Generate a concise list of 2-4 relevant project ideas or feature enhancements that Atif could develop.
Focus on ideas that are actionable and align with Atif's demonstrated skills.
Present the ideas as a simple list or bullet points. Make them sound like helpful suggestions for the client.
For example:
- "Develop a customer loyalty program module for your '{{{projectContext}}}'."
- "Create interactive visualizations to better track user engagement."
- "Implement an AI-powered recommendation engine to personalize user experience."
`,
});

const suggestProjectIdeasFlow = ai.defineFlow(
  {
    name: 'suggestProjectIdeasFlow',
    inputSchema: SuggestProjectIdeasInputSchema,
    outputSchema: SuggestProjectIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    