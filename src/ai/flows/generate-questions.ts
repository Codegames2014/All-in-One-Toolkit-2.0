'use server';

/**
 * @fileOverview An AI agent for generating questions from text.
 *
 * - generateQuestions - A function that generates questions from a given topic or text.
 * - GenerateQuestionsInput - The input type for the generateQuestions function.
 * - GenerateQuestionsOutput - The return type for the generateQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuestionsInputSchema = z.object({
  text: z.string().describe('The topic or block of text to generate questions from.'),
});
export type GenerateQuestionsInput = z.infer<typeof GenerateQuestionsInputSchema>;

const GenerateQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('An array of generated questions.'),
});
export type GenerateQuestionsOutput = z.infer<typeof GenerateQuestionsOutputSchema>;

export async function generateQuestions(input: GenerateQuestionsInput): Promise<GenerateQuestionsOutput> {
  return generateQuestionsFlow(input);
}

const generateQuestionsPrompt = ai.definePrompt({
    name: 'generateQuestionsPrompt',
    input: {schema: GenerateQuestionsInputSchema},
    output: {schema: GenerateQuestionsOutputSchema},
    prompt: `You are an expert at creating educational and thought-provoking questions. Based on the following text or topic, generate a list of 5-10 insightful questions.

    Topic/Text:
    {{{text}}}
    `
});

const generateQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuestionsFlow',
    inputSchema: GenerateQuestionsInputSchema,
    outputSchema: GenerateQuestionsOutputSchema,
  },
  async (input) => {
    const {output} = await generateQuestionsPrompt(input);
    return output!;
  }
);
