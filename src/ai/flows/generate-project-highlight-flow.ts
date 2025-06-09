
'use server';
/**
 * @fileOverview An AI agent to generate a title and short description for a project highlight.
 *
 * - generateProjectHighlight - Generates a catchy title and a brief description for a project.
 * - GenerateProjectHighlightInput - Input for the project highlight generation.
 * - GenerateProjectHighlightOutput - Output for the project highlight generation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectHighlightInputSchema = z.object({
  projectCategory: z.string().describe('The general category of the project (e.g., "E-commerce Platform", "Data Analytics Dashboard", "Mobile App", "Branding Suite").'),
  coreTechnologies: z.array(z.string()).optional().describe('Main technologies or tools used (e.g., "Next.js, Python", "Figma, Illustrator").'),
  uniqueSellingPoints: z.array(z.string()).optional().describe('What makes this project type stand out or what key problem it solved (e.g., "Increased user engagement by 20%", "Modernized legacy system").'),
  clientIndustry: z.string().optional().describe('The industry of the client for whom the project was done (e.g., "Healthcare", "FinTech", "Retail").')
});
export type GenerateProjectHighlightInput = z.infer<typeof GenerateProjectHighlightInputSchema>;

const GenerateProjectHighlightOutputSchema = z.object({
  suggestedTitle: z.string().describe('A creative and descriptive title for the project. Should be concise.'),
  shortDescription: z.string().describe('A brief (1-2 sentences) description highlighting the project\'s essence, technologies, or impact.'),
});
export type GenerateProjectHighlightOutput = z.infer<typeof GenerateProjectHighlightOutputSchema>;

export async function generateProjectHighlight(input: GenerateProjectHighlightInput): Promise<GenerateProjectHighlightOutput> {
  return generateProjectHighlightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectHighlightPrompt',
  input: {schema: GenerateProjectHighlightInputSchema},
  output: {schema: GenerateProjectHighlightOutputSchema},
  prompt: `You are an AI copywriter tasked with creating a compelling title and a short description for a portfolio project.

Project Category: {{projectCategory}}
{{#if coreTechnologies.length}}
Core Technologies/Tools: {{#each coreTechnologies}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}
{{#if uniqueSellingPoints.length}}
Unique Selling Points/Achievements:
{{#each uniqueSellingPoints}}
- {{{this}}}
{{/each}}
{{/if}}
{{#if clientIndustry}}
Client Industry: {{clientIndustry}}
{{/if}}

Based on the information provided:
1. Generate a catchy and concise 'suggestedTitle' for the project.
2. Write a 'shortDescription' (1-2 sentences) that captures the essence of the project. It should be engaging and can mention key technologies or impact if relevant.

For example, if projectCategory is "E-commerce Platform", coreTechnologies are "Next.js, Stripe", and USP is "Increased conversion by 15%":
Suggested Title: Dynamic E-Shop Solution
Short Description: A cutting-edge e-commerce platform built with Next.js and Stripe, driving a 15% increase in client conversions.
`,
});

const generateProjectHighlightFlow = ai.defineFlow(
  {
    name: 'generateProjectHighlightFlow',
    inputSchema: GenerateProjectHighlightInputSchema,
    outputSchema: GenerateProjectHighlightOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
