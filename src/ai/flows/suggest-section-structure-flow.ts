
'use server';
/**
 * @fileOverview An AI agent to suggest a structure for a new website section.
 *
 * - suggestSectionStructure - Generates a suggested title, content blocks, and layout idea.
 * - SuggestSectionStructureInput - Input for the section structure suggestion.
 * - SuggestSectionStructureOutput - Output for the section structure suggestion.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestedBlockSchema = z.object({
  blockType: z.string().describe('Type of content block (e.g., "Introductory Paragraph", "Service Item List (3 items)", "Project Showcase (single featured project)", "Call to Action"). Be descriptive.'),
  description: z.string().describe('What this block should contain or achieve within the section.'),
  contentHint: z.string().optional().describe('A detailed and actionable hint for the content of this block. This could be a 1-2 sentence example, or a clear mini-prompt for another AI tool. Should align with the overall desired tone of the section.'),
});
export type SuggestedBlock = z.infer<typeof SuggestedBlockSchema>;

const SuggestSectionStructureInputSchema = z.object({
  sectionTopic: z.string().describe('Main purpose or topic of the section (e.g., "Showcasing my web design services", "Explaining my work process", "Why choose me?").'),
  targetAudience: z.string().optional().describe('Who is this section primarily for? (e.g., "Startups", "Technical Managers", "Non-technical clients").'),
  desiredTone: z.enum(['professional', 'creative', 'technical', 'friendly', 'persuasive']).default('professional').optional().describe('The desired tone for the content in this section. This tone should influence the generated content hints.'),
  keyElementsToInclude: z.array(z.string()).optional().describe('A list of specific elements or information the user definitely wants to include in this section (e.g., "My top 3 projects", "A client testimonial", "Pricing information").'),
});
export type SuggestSectionStructureInput = z.infer<typeof SuggestSectionStructureInputSchema>;

const SuggestSectionStructureOutputSchema = z.object({
  suggestedSectionTitle: z.string().describe('A compelling and relevant title for the suggested website section.'),
  suggestedBlocks: z.array(SuggestedBlockSchema).describe('An ordered list of suggested content blocks that make up the section.'),
  layoutIdea: z.string().describe('A brief textual description of how these blocks could be visually arranged on the page (e.g., "Start with a full-width intro, followed by services in a 3-column grid, and a concluding call to action.").'),
  rationale: z.string().optional().describe('A short explanation of why this particular structure and combination of blocks are recommended for the given topic and audience.'),
});
export type SuggestSectionStructureOutput = z.infer<typeof SuggestSectionStructureOutputSchema>;

export async function suggestSectionStructure(input: SuggestSectionStructureInput): Promise<SuggestSectionStructureOutput> {
  return suggestSectionStructureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSectionStructurePrompt',
  input: {schema: SuggestSectionStructureInputSchema},
  output: {schema: SuggestSectionStructureOutputSchema},
  prompt: `You are an expert web designer and content strategist AI. Your task is to help a user plan a new section for their personal portfolio website.

User's Goal for the section:
Topic: {{sectionTopic}}
{{#if targetAudience}}Target Audience: {{targetAudience}}{{/if}}
Desired Tone for the section content: {{desiredTone}}. This tone MUST strongly influence the 'contentHint' for each block.
{{#if keyElementsToInclude.length}}
Key Elements to Include:
{{#each keyElementsToInclude}}
- {{{this}}}
{{/each}}
{{/if}}

Based on this, suggest a structure for this new website section.
Consider common and effective website section patterns. The user has access to tools that can generate specific atomic content blocks like:
- "Hero Text Block" (comprising a main headline and a sub-headline)
- "About Paragraph Block" (a single paragraph of text)
- "Service Item Block" (includes a title, description, and an icon concept; can be used multiple times to form a list)
- "Project Highlight Block" (includes a title, short description, and an image concept; can be used multiple times)
- "Testimonial Quote Block" (includes a quote, author, and role)
- "Call to Action Block" (typically a button or a short phrase encouraging an action)

Your suggestion should include:
1.  'suggestedSectionTitle': A catchy and descriptive title for the section.
2.  'suggestedBlocks': An ordered array of content blocks. For each block:
    *   'blockType': Describe the type of block (e.g., "Engaging Introduction Paragraph", "Key Services Showcase (3 items)", "Featured Project Spotlight", "Client Success Story", "Clear Call to Action"). You can suggest combinations or lists of the atomic blocks mentioned above.
    *   'description': Explain the purpose of this block within the section and what key information it should convey.
    *   'contentHint' (optional but highly recommended): Provide a DETAILED and ACTIONABLE hint for the content of this block. This should be more than just a topic; aim for a 1-2 sentence example of what the content could be, or a clear mini-prompt that the user could give to another AI to generate the full content for that block. This hint MUST reflect the 'desiredTone' of the section. For instance, if desiredTone is 'creative' and blockType is 'About Paragraph Block' for a photography portfolio, a contentHint might be: "Generate an engaging paragraph that starts with 'Through my lens, the world transforms...' and highlights a unique artistic approach."
3.  'layoutIdea': A brief textual description of a possible visual arrangement for these blocks.
4.  'rationale' (optional): Briefly explain why this structure is suitable for the user's goal.

Focus on creating a logical flow that would be engaging and informative for the {{#if targetAudience}}{{targetAudience}}{{else}}target audience{{/if}}.
Ensure the 'suggestedBlocks' array is well-structured and provides clear, actionable guidance, especially in the 'contentHint' field reflecting the 'desiredTone'.
Output ONLY the JSON object as specified by the output schema.
`,
});

const suggestSectionStructureFlow = ai.defineFlow(
  {
    name: 'suggestSectionStructureFlow',
    inputSchema: SuggestSectionStructureInputSchema,
    outputSchema: SuggestSectionStructureOutputSchema,
  },
  async (input) => {
    // Ensure optional arrays are present for the prompt
    const effectiveInput = {
      ...input,
      desiredTone: input.desiredTone || 'professional', // Default tone if not provided
      keyElementsToInclude: input.keyElementsToInclude || [],
    };
    const {output} = await prompt(effectiveInput);
    return output!;
  }
);

