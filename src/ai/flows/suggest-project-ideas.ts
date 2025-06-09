'use server';

/**
 * @fileOverview An AI agent to suggest project ideas based on Atif's portfolio and expertise.
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
    .describe('Description of the potential client\'s business needs.'),
  atifPortfolio: z
    .string()
    .describe('Description of Atif\'s portfolio and expertise.'),
});
export type SuggestProjectIdeasInput = z.infer<typeof SuggestProjectIdeasInputSchema>;

const SuggestProjectIdeasOutputSchema = z.object({
  projectIdeas: z
    .string()
    .describe('A list of project ideas tailored to the client\'s business needs, based on Atif\'s portfolio.'),
});
export type SuggestProjectIdeasOutput = z.infer<typeof SuggestProjectIdeasOutputSchema>;

export async function suggestProjectIdeas(input: SuggestProjectIdeasInput): Promise<SuggestProjectIdeasOutput> {
  return suggestProjectIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProjectIdeasPrompt',
  input: {schema: SuggestProjectIdeasInputSchema},
  output: {schema: SuggestProjectIdeasOutputSchema},
  prompt: `You are an AI assistant tasked with generating project ideas for potential clients based on a given portfolio and their business needs.\n\nPortfolio: {{{atifPortfolio}}}\nBusiness Needs: {{{businessNeeds}}}\n\nGenerate a list of project ideas that leverage the portfolio to address the business needs. Be creative and think outside the box.`,
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
