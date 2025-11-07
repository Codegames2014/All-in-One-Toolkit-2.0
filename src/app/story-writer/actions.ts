"use server";

import { generateStory, type GenerateStoryInput } from "@/ai/flows/generate-story";
import { z } from "zod";

const FormSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters long."),
});

type GenerationResult = {
  success: boolean;
  data?: string;
  error?: string;
};

export async function handleStoryGeneration(
  input: GenerateStoryInput
): Promise<GenerationResult> {
  const parsed = FormSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid input." };
  }

  try {
    const { story } = await generateStory(parsed.data);
    return { success: true, data: story };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}
