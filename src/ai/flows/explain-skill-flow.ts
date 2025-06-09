'use server';
/**
 * @fileOverview An AI agent to explain Atif's skills based on his portfolio.
 *
 * - explainSkill - A function that explains a given skill in the context of Atif's expertise.
 * - ExplainSkillInput - The input type for the explainSkill function.
 * - ExplainSkillOutput - The return type for the explainSkill function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainSkillInputSchema = z.object({
  skillQuery: z
    .string()
    .describe('The skill or area of expertise the user is asking about (e.g., "Next.js", "Prompt Engineering").'),
  atifPortfolio: z
    .string()
    .describe('Description of Atif\'s portfolio and expertise.'),
});
export type ExplainSkillInput = z.infer<typeof ExplainSkillInputSchema>;

const ExplainSkillOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A concise explanation of the skill and how Atif applies it, referencing his portfolio if possible.'),
});
export type ExplainSkillOutput = z.infer<typeof ExplainSkillOutputSchema>;

export async function explainSkill(input: ExplainSkillInput): Promise<ExplainSkillOutput> {
  return explainSkillFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainSkillPrompt',
  input: {schema: ExplainSkillInputSchema},
  output: {schema: ExplainSkillOutputSchema},
  prompt: `You are an AI assistant helping a potential client understand Atif's skills.
Atif's portfolio summary: {{{atifPortfolio}}}

The client is asking about the skill: "{{{skillQuery}}}"

Based on Atif's portfolio and general knowledge of the skill, provide a concise explanation of what the skill entails and how Atif likely utilizes or demonstrates this skill.
If "{{{skillQuery}}}" is 'Prompt Engineering', emphasize its importance in leveraging AI tools effectively and highlight Atif's proficiency.
If "{{{skillQuery}}}" is a technology or concept present in his portfolio, try to connect it to his project experiences.
Keep the explanation engaging and informative for someone evaluating Atif's capabilities.
Focus on providing a helpful and positive perspective on Atif's expertise related to "{{{skillQuery}}}".`,
});

const explainSkillFlow = ai.defineFlow(
  {
    name: 'explainSkillFlow',
    inputSchema: ExplainSkillInputSchema,
    outputSchema: ExplainSkillOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
