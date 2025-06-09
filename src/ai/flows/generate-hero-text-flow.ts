
'use server';
/**
 * @fileOverview An AI agent to generate compelling hero text for a portfolio.
 *
 * - generateHeroText - A function that generates a main headline and sub-headline.
 * - GenerateHeroTextInput - The input type for the generateHeroText function.
 * - GenerateHeroTextOutput - The return type for the generateHeroText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHeroTextInputSchema = z.object({
  topic: z.string().describe('The main topic or name for the hero section (e.g., "Atif R.", "My Portfolio").'),
  keywords: z.array(z.string()).optional().describe('A list of keywords or skills to hint at (e.g., "Full-Stack", "UI/UX", "Creative").'),
  tone: z.enum(['professional', 'engaging', 'bold', 'innovative']).default('engaging').describe('The desired tone of the generated text.'),
  roleFocus: z.string().optional().describe('A primary role or expertise to emphasize, e.g., "Full-Stack Developer" or "Graphics Designer".')
});
export type GenerateHeroTextInput = z.infer<typeof GenerateHeroTextInputSchema>;

const GenerateHeroTextOutputSchema = z.object({
  mainHeadline: z.string().describe('A catchy and prominent main headline. Should incorporate the topic/name provided.'),
  subHeadline: z.string().describe('An engaging sub-headline that complements the main headline, possibly using keywords or role focus.'),
});
export type GenerateHeroTextOutput = z.infer<typeof GenerateHeroTextOutputSchema>;

export async function generateHeroText(input: GenerateHeroTextInput): Promise<GenerateHeroTextOutput> {
  return generateHeroTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHeroTextPrompt',
  input: {schema: GenerateHeroTextInputSchema},
  output: {schema: GenerateHeroTextOutputSchema},
  prompt: `You are an expert copywriter crafting a hero section for a personal portfolio.
The main topic/name for the hero section is: "{{topic}}".
The desired tone is: {{tone}}.

{{#if keywords.length}}
Consider these keywords:
{{#each keywords}}
- {{{this}}}
{{/each}}
{{/if}}

{{#if roleFocus}}
The primary role to emphasize is: "{{roleFocus}}".
{{/if}}

Generate a compelling main headline that prominently features "{{topic}}".
Then, create a sub-headline that is engaging, complements the main headline, and subtly incorporates the keywords or the role focus if provided.
The sub-headline should be suitable for a typing animation effect, possibly listing a few roles or a captivating phrase.

Example for Atif R. (Full-Stack Developer):
Main Headline: Hello, I'm Atif R.
SubHeadline: A Full-Stack Developer Crafting Digital Experiences. (Or: I am a Full-Stack Developer | UI/UX Enthusiast | Creative Thinker)
`,
});

const generateHeroTextFlow = ai.defineFlow(
  {
    name: 'generateHeroTextFlow',
    inputSchema: GenerateHeroTextInputSchema,
    outputSchema: GenerateHeroTextOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
