"use server";

/**
 * @fileOverview AI-powered logo generation flow.
 *
 * - generateLogo - A function that accepts a text prompt to generate a logo.
 * - GenerateLogoInput - The input type for the generateLogo function.
 * - GenerateLogoOutput - The return type for the generateLogo function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const GenerateLogoInputSchema = z.object({
  prompt: z.string().describe("The text prompt describing the desired logo."),
});
export type GenerateLogoInput = z.infer<typeof GenerateLogoInputSchema>;

const GenerateLogoOutputSchema = z.object({
  logoDataUri: z
    .string()
    .describe(
      "The generated logo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateLogoOutput = z.infer<typeof GenerateLogoOutputSchema>;

export async function generateLogo(
  input: GenerateLogoInput
): Promise<GenerateLogoOutput> {
  return generateLogoFlow(input);
}

const generateLogoFlow = ai.defineFlow(
  {
    name: "generateLogoFlow",
    inputSchema: GenerateLogoInputSchema,
    outputSchema: GenerateLogoOutputSchema,
  },
  async ({ prompt }) => {
    const fullPrompt = `A professional, clean, vector-style logo for: "${prompt}".
    The logo should be on a plain white background, simple, modern, and easily recognizable. Avoid overly complex details. If text is included, it should be clearly legible.`;

    const { media } = await ai.generate({
      model: "googleai/imagen-4.0-fast-generate-001",
      prompt: fullPrompt,
    });

    if (!media?.url) {
      throw new Error("The model did not return an image.");
    }
    return { logoDataUri: media.url };
  }
);
