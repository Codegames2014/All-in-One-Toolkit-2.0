'use server';

/**
 * @fileOverview An AI agent for answering questions.
 *
 * - answerQuestion - A function that handles answering a user's question.
 * - AnswerQuestionInput - The input type for the answerQuestion function.
 * - AnswerQuestionOutput - The return type for the answerQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnswerQuestionInputSchema = z.object({
  prompt: z.string().describe('The user\'s question.'),
});
export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

export const AnswerQuestionOutputSchema = z.object({
  answer: z.string().describe('The AI\'s answer to the question.'),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  return answerQuestionFlow(input);
}

const answerQuestionPrompt = ai.definePrompt({
    name: 'answerQuestionPrompt',
    input: {schema: AnswerQuestionInputSchema},
    output: {schema: AnswerQuestionOutputSchema},
    prompt: `You are an expert Q&A assistant. Your goal is to provide a clear, concise, and accurate answer to the user's question.

    Question: {{{prompt}}}
    
    Answer:
    `
});

const answerQuestionFlow = ai.defineFlow(
  {
    name: 'answerQuestionFlow',
    inputSchema: AnswerQuestionInputSchema,
    outputSchema: AnswerQuestionOutputSchema,
  },
  async (input) => {
    const {output} = await answerQuestionPrompt(input);
    return output!;
  }
);
