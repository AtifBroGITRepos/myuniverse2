'use server';

/**
 * @fileOverview Generates personalized testimonials based on Atif's projects.
 *
 * - generateTestimonials - A function that generates personalized testimonials.
 * - GenerateTestimonialsInput - The input type for the generateTestimonials function.
 * - GenerateTestimonialsOutput - The return type for the generateTestimonials function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTestimonialsInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('The description of the project for which to generate a testimonial.'),
  clientNeeds: z.string().describe('The specific needs of the potential client.'),
});
export type GenerateTestimonialsInput = z.infer<typeof GenerateTestimonialsInputSchema>;

const GenerateTestimonialsOutputSchema = z.object({
  testimonial: z
    .string()
    .describe('A personalized testimonial based on the project and client needs.'),
});
export type GenerateTestimonialsOutput = z.infer<typeof GenerateTestimonialsOutputSchema>;

export async function generateTestimonials(input: GenerateTestimonialsInput): Promise<GenerateTestimonialsOutput> {
  return generateTestimonialsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTestimonialsPrompt',
  input: {schema: GenerateTestimonialsInputSchema},
  output: {schema: GenerateTestimonialsOutputSchema},
  prompt: `You are an AI assistant designed to generate personalized testimonials for Atif, a highly skilled professional. A potential client is reviewing Atif's portfolio.

  Generate a testimonial based on the following project description and the client's specific needs. The testimonial should highlight the relevance and impact of Atif's work to the client's needs.

  Project Description: {{{projectDescription}}}
  Client Needs: {{{clientNeeds}}}

  Testimonial:`,
});

const generateTestimonialsFlow = ai.defineFlow(
  {
    name: 'generateTestimonialsFlow',
    inputSchema: GenerateTestimonialsInputSchema,
    outputSchema: GenerateTestimonialsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
