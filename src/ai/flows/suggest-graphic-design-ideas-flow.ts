
'use server';
/**
 * @fileOverview An AI agent to suggest graphic design ideas.
 *
 * - suggestGraphicDesignIdeas - A function that suggests graphic design concepts.
 * - SuggestGraphicDesignIdeasInput - The input type for the suggestGraphicDesignIdeas function.
 * - SuggestGraphicDesignIdeasOutput - The return type for the suggestGraphicDesignIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestGraphicDesignIdeasInputSchema = z.object({
  projectType: z
    .string()
    .describe('The type of graphic design project (e.g., "Logo Design", "Brand Identity", "Social Media Campaign", "Website UI Mockup").'),
  brandKeywords: z
    .array(z.string())
    .optional()
    .describe('Keywords describing the brand or desired style (e.g., "Modern", "Minimalist", "Playful", "Tech", "Elegant").'),
  targetAudience: z
    .string()
    .optional()
    .describe('The primary target audience for the design (e.g., "Startups", "Young Professionals", "Luxury Consumers").'),
  additionalInfo: z
    .string()
    .optional()
    .describe('Any other specific requests, preferences, or context for the design project.'),
  atifPortfolioContext: z
    .string()
    .describe('Brief description of Atif\'s design portfolio and general style to provide context.'),
});
export type SuggestGraphicDesignIdeasInput = z.infer<typeof SuggestGraphicDesignIdeasInputSchema>;

const SuggestGraphicDesignIdeasOutputSchema = z.object({
  designIdeas: z
    .string()
    .describe('A list of 2-4 graphic design ideas, concepts, or directions. This could include suggestions for color palettes, typography, imagery style, or overall aesthetic. Presented as bullet points or a short paragraph per idea.'),
});
export type SuggestGraphicDesignIdeasOutput = z.infer<typeof SuggestGraphicDesignIdeasOutputSchema>;

export async function suggestGraphicDesignIdeas(input: SuggestGraphicDesignIdeasInput): Promise<SuggestGraphicDesignIdeasOutput> {
  return suggestGraphicDesignIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestGraphicDesignIdeasPrompt',
  input: {schema: SuggestGraphicDesignIdeasInputSchema},
  output: {schema: SuggestGraphicDesignIdeasOutputSchema},
  prompt: `You are an expert Creative Director specializing in graphic design, brainstorming ideas for Atif, a skilled Graphics Designer.
Atif's general design approach/portfolio context: {{{atifPortfolioContext}}}

Client Request Details:
Project Type: {{{projectType}}}
{{#if brandKeywords.length}}
Brand Keywords/Style: {{#each brandKeywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}
{{#if targetAudience}}
Target Audience: {{{targetAudience}}}
{{/if}}
{{#if additionalInfo}}
Additional Information/Preferences: {{{additionalInfo}}}
{{/if}}

Based on the client's request and considering Atif's design context, generate 2-4 distinct and creative graphic design ideas or directions.
For each idea, briefly describe the concept. You can include suggestions for:
- Overall aesthetic (e.g., "Clean and corporate", "Vibrant and energetic")
- Potential color palette ideas (e.g., "Monochromatic blues with a pop of yellow", "Earthy tones")
- Typography style (e.g., "Modern sans-serif", "Classic serif with a twist")
- Imagery or illustration style (e.g., "Abstract geometric patterns", "Minimalist line art")

Present the ideas clearly, perhaps as bullet points or short paragraphs for each concept.
Example for "Logo Design", "Modern, Tech":
- Idea 1: Geometric Simplicity. A logo using interconnected geometric shapes to symbolize technology and connectivity. Colors: Deep blue and silver. Typography: A clean, futuristic sans-serif.
- Idea 2: Abstract Network. An abstract representation of a network or data flow, conveying innovation. Colors: Gradient of teal to purple. Typography: Sleek, minimalist font.
`,
});

const suggestGraphicDesignIdeasFlow = ai.defineFlow(
  {
    name: 'suggestGraphicDesignIdeasFlow',
    inputSchema: SuggestGraphicDesignIdeasInputSchema,
    outputSchema: SuggestGraphicDesignIdeasOutputSchema,
  },
  async input => {
    const effectiveInput = {
      ...input,
      brandKeywords: input.brandKeywords || [],
    };
    const {output} = await prompt(effectiveInput);
    return output!;
  }
);
