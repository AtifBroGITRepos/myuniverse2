
'use server';
/**
 * @fileOverview An AI agent to summarize a list of messages.
 *
 * - summarizeMessages - A function that summarizes messages.
 * - SummarizeMessagesInput - The input type for the summarizeMessages function.
 * - SummarizeMessagesOutput - The return type for the summarizeMessages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { AdminMessage } from '@/data/constants';


const MessageSchema = z.object({
  id: z.string(),
  name: z.string().describe("Sender's name"),
  email: z.string().email().describe("Sender's email"),
  message: z.string().describe("The content of the message"),
  receivedAt: z.string().describe("Timestamp when message was received"),
});


const SummarizeMessagesInputSchema = z.object({
  messages: z.array(MessageSchema).describe('An array of message objects to be summarized.'),
});
export type SummarizeMessagesInput = z.infer<typeof SummarizeMessagesInputSchema>;

const SummarizeMessagesOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of all provided messages, highlighting common themes, key questions, or urgent issues.'),
});
export type SummarizeMessagesOutput = z.infer<typeof SummarizeMessagesOutputSchema>;

export async function summarizeMessages(input: SummarizeMessagesInput): Promise<SummarizeMessagesOutput> {
  if (!input.messages || input.messages.length === 0) {
    return { summary: "No messages provided to summarize." };
  }
  return summarizeMessagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMessagesPrompt',
  input: {schema: SummarizeMessagesInputSchema},
  output: {schema: SummarizeMessagesOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing a collection of messages.
For each message, note the sender's name and email.
Provide a concise summary of all messages, highlighting common themes, key questions, or urgent issues.

Messages:
{{#each messages}}
- Sender: {{name}} ({{email}})
  Received: {{receivedAt}}
  Message: {{{message}}}
---
{{/each}}

Overall Summary:`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const summarizeMessagesFlow = ai.defineFlow(
  {
    name: 'summarizeMessagesFlow',
    inputSchema: SummarizeMessagesInputSchema,
    outputSchema: SummarizeMessagesOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input); // This is the call to the LLM
      if (!output) {
          console.error('Summarize messages flow: LLM did not return a valid output or the output was null. This could be due to API key issues, model compatibility, content filters, or the model not adhering to the output schema. Check API key and server logs for details from the Genkit/Google AI plugin.');
          throw new Error("AI model failed to generate a summary. The model returned no valid output. Please check server logs for more details from the AI provider.");
      }
      return output;
    } catch (error: any) {
      console.error('Summarize messages flow: An exception occurred during the AI prompt execution. Full error:', error);
      // Construct a more informative error message
      let errorMessage = "AI model failed to generate a summary due to an unexpected error during the AI call.";
      if (error.message) {
        errorMessage += ` Details: ${error.message}`;
      }
      // It's good practice to avoid exposing raw error details to the client in production,
      // but for debugging in the admin panel, this can be helpful.
      // The console.error above will have the full details for server-side inspection.
      throw new Error(errorMessage + " Please check server logs for specific error codes or messages from the AI provider.");
    }
  }
);

