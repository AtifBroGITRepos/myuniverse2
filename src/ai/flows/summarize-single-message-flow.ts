
'use server';
/**
 * @fileOverview An AI agent to summarize a single message.
 *
 * - summarizeSingleMessage - A function that summarizes a given message content.
 * - SummarizeSingleMessageInput - The input type for the summarizeSingleMessage function.
 * - SummarizeSingleMessageOutput - The return type for the summarizeSingleMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSingleMessageInputSchema = z.object({
  messageContent: z.string().describe('The full text content of the message to be summarized.'),
  senderName: z.string().optional().describe("Optional: The name of the message sender for context."),
  contextHint: z.string().optional().describe("Optional: A hint about what to focus on in the summary, e.g., 'Extract key questions' or 'Identify main request'.")
});
export type SummarizeSingleMessageInput = z.infer<typeof SummarizeSingleMessageInputSchema>;

const SummarizeSingleMessageOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the provided message content, highlighting key points, requests, or questions.'),
});
export type SummarizeSingleMessageOutput = z.infer<typeof SummarizeSingleMessageOutputSchema>;

export async function summarizeSingleMessage(input: SummarizeSingleMessageInput): Promise<SummarizeSingleMessageOutput> {
  if (!input.messageContent.trim()) {
    return { summary: "No content provided to summarize." };
  }
  return summarizeSingleMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSingleMessagePrompt',
  input: {schema: SummarizeSingleMessageInputSchema},
  output: {schema: SummarizeSingleMessageOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing a single message.
{{#if senderName}}
The message is from: {{senderName}}.
{{/if}}
{{#if contextHint}}
Focus on the following when summarizing: "{{contextHint}}".
{{else}}
Your goal is to provide a concise summary of the main points, key questions, or urgent requests mentioned in the message.
{{/if}}

Message Content:
"""
{{{messageContent}}}
"""

Based on the content, provide a clear and brief summary.
If the message is very short, the summary can be the message itself or a slightly rephrased version.
Output only the summary.
`,
  config: {
    safetySettings: [ // More permissive settings, adjust as needed
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  },
});

const summarizeSingleMessageFlow = ai.defineFlow(
  {
    name: 'summarizeSingleMessageFlow',
    inputSchema: SummarizeSingleMessageInputSchema,
    outputSchema: SummarizeSingleMessageOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      if (!output) {
          const errorMessage = 'AI model did not return a valid summary for the single message. This could be due to content filters or an issue with the AI service.';
          console.error(`summarizeSingleMessageFlow: ${errorMessage} Input received:`, JSON.stringify(input));
          throw new Error(errorMessage);
      }
      return output;
    } catch (error: any) {
      console.error('summarizeSingleMessageFlow: An exception occurred during the AI prompt execution.', error);
      throw new Error(error.message || 'AI model failed to generate a summary for the message due to an unexpected error.');
    }
  }
);
