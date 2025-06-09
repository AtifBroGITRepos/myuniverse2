
'use server';
/**
 * @fileOverview An AI agent to generate or refine an "About Me" text for a portfolio.
 *
 * - generateAboutText - A function that generates or refines "About Me" text.
 * - GenerateAboutTextInput - The input type for the generateAboutText function.
 * - GenerateAboutTextOutput - The return type for the generateAboutText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAboutTextInputSchema = z.object({
  currentText: z.string().optional().describe('The current "About Me" text, if any.'),
  keywords: z.array(z.string()).optional().describe('A list of keywords or skills to highlight (e.g., "Full-Stack Developer", "UI/UX", "Creative Thinker").'),
  tone: z.enum(['professional', 'friendly', 'innovative']).default('professional').describe('The desired tone of the generated text.'),
});
export type GenerateAboutTextInput = z.infer<typeof GenerateAboutTextInputSchema>;

const GenerateAboutTextOutputSchema = z.object({
  suggestedText: z
    .string()
    .describe('The AI-generated or refined "About Me" text.'),
});
export type GenerateAboutTextOutput = z.infer<typeof GenerateAboutTextOutputSchema>;

export async function generateAboutText(input: GenerateAboutTextInput): Promise<GenerateAboutTextOutput> {
  return generateAboutTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAboutTextPrompt',
  input: {schema: GenerateAboutTextInputSchema},
  output: {schema: GenerateAboutTextOutputSchema},
  prompt: `You are an expert copywriter tasked with crafting an engaging "About Me" section for a personal portfolio.
The tone should be {{tone}}.

{{#if currentText}}
The current "About Me" text is:
"{{{currentText}}}"
Please refine this text or use it as inspiration.
{{else}}
Please generate a new "About Me" text from scratch.
{{/if}}

{{#if keywords.length}}
Ensure the following keywords or concepts are naturally woven into the text:
{{#each keywords}}
- {{{this}}}
{{/each}}
{{/if}}

The output should be a single, coherent paragraph, or a few short paragraphs, suitable for a portfolio's "About Me" section. Focus on highlighting skills, passion, and value proposition.
Make it concise yet impactful.
`,
});

const generateAboutTextFlow = ai.defineFlow(
  {
    name: 'generateAboutTextFlow',
    inputSchema: GenerateAboutTextInputSchema,
    outputSchema: GenerateAboutTextOutputSchema,
  },
  async (input) => {
    // Ensure keywords is an array even if not provided
    const effectiveInput = {
      ...input,
      keywords: input.keywords || [],
    };
    const {output} = await prompt(effectiveInput);
    return output!;
  }
);
