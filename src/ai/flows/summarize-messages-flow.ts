
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
    const {output} = await prompt(input);
    // If output is null or undefined here, it means the LLM call failed to produce valid output
    // according to the schema, or was blocked. Genkit's prompt() should ideally throw an error
    // in such cases, which would be caught by the UI.
    if (!output) {
        // This case should ideally be handled by Genkit throwing an error,
        // but as a fallback, we can construct an error-like response.
        console.error('Summarize messages flow: LLM did not return a valid output.');
        // Returning a structured error or throwing one here is also an option.
        // For now, let the non-null assertion below potentially fail if Genkit's behavior changes,
        // or rely on Genkit to throw before this point.
        // However, to be more robust for the user's specific error message:
        throw new Error("LLM failed to generate summary, output was null/undefined.");
    }
    return output; // Removed the non-null assertion '!' to see if an error propagates more clearly
                  // However, if the schema guarantees output, 'output!' is fine.
                  // For now, let's keep it as `return output;` and assume `prompt` throws on failure
                  // or returns a valid structure. If errors persist with "output is null", we might need `output!`.
                  // Re-evaluating: Genkit `prompt` returns `Promise<{ output: OutputType | null, ... }>`
                  // So `output` CAN be null if the model doesn't produce it.
                  // The original `return output!;` is correct if we assume an error will be thrown by Genkit or the model
                  // if content generation fails significantly (e.g. safety).
                  // If the model just returns nothing that matches schema, output can be null.
                  // Let's stick to output! as it was, and rely on the safety settings.
                  // If output is null and not an error, it implies the model responded but didn't fill the schema.
    return output!;
  }
);

