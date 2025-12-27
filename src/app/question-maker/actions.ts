"use server";

import { generateQuestions, type GenerateQuestionsInput } from "@/ai/flows/generate-questions";
import { z } from "zod";

const FormSchema = z.object({
  text: z.string().min(10, "Please enter at least 10 characters of text or a topic."),
});

type Result = {
  success: boolean;
  data?: string[];
  error?: string;
};

export async function handleQuestionGeneration(
  input: GenerateQuestionsInput
): Promise<Result> {
  const parsed = FormSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid input." };
  }

  try {
    const { questions } = await generateQuestions(parsed.data);
    return { success: true, data: questions };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}
