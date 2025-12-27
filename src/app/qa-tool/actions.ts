"use server";

import { answerQuestion, type AnswerQuestionInput } from "@/ai/flows/answer-question";
import { z } from "zod";

const FormSchema = z.object({
  prompt: z.string().min(5, "Question must be at least 5 characters long."),
});

type Result = {
  success: boolean;
  data?: string;
  error?: string;
};

export async function handleQuestion(
  input: AnswerQuestionInput
): Promise<Result> {
  const parsed = FormSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid input." };
  }

  try {
    const { answer } = await answerQuestion(parsed.data);
    return { success: true, data: answer };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}
