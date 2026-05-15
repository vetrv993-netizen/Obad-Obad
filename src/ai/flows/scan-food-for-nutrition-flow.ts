'use server';
/**
 * @fileOverview A Genkit flow for scanning a food item from an image and providing its nutritional information.
 *
 * - scanFoodForNutrition - A function that handles the food scanning and nutrition analysis process.
 * - ScanFoodForNutritionInput - The input type for the scanFoodForNutrition function.
 * - ScanFoodForNutritionOutput - The return type for the scanFoodForNutrition function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ScanFoodForNutritionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a food item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z
    .string()
    .optional()
    .describe('An optional text description of the food item.'),
});
export type ScanFoodForNutritionInput = z.infer<
  typeof ScanFoodForNutritionInputSchema
>;

const ScanFoodForNutritionOutputSchema = z.object({
  foodName: z.string().describe('The identified name of the food item.'),
  calories: z.number().describe('The estimated total calories of the food item.'),
  protein: z.number().describe('The estimated protein content in grams.'),
  fat: z.number().describe('The estimated fat content in grams.'),
  carbohydrates: z
    .number()
    .describe('The estimated carbohydrates content in grams.'),
  servingSize: z.string().describe('The serving size the nutrition information is based on (e.g., "per 100g", "per serving").'),
});
export type ScanFoodForNutritionOutput = z.infer<
  typeof ScanFoodForNutritionOutputSchema
>;

export async function scanFoodForNutrition(
  input: ScanFoodForNutritionInput
): Promise<ScanFoodForNutritionOutput> {
  return scanFoodForNutritionFlow(input);
}

const scanFoodForNutritionPrompt = ai.definePrompt({
  name: 'scanFoodForNutritionPrompt',
  input: { schema: ScanFoodForNutritionInputSchema },
  output: { schema: ScanFoodForNutritionOutputSchema },
  model: 'googleai/gemini-2.5-flash-image',
  config: {
    responseModalities: ['TEXT'],
  },
  prompt: `You are an expert nutritionist and food identification AI.
Your task is to analyze the provided image of a food item and its description (if available),
and then extract its nutritional information. Be as accurate as possible.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}

Provide the output in a JSON format matching the following structure:
{
  "foodName": "string",
  "calories": "number",
  "protein": "number",
  "fat": "number",
  "carbohydrates": "number",
  "servingSize": "string"
}

If the input does not appear to be food, set foodName to "Not Food" and other numeric values to 0.`,
});

const scanFoodForNutritionFlow = ai.defineFlow(
  {
    name: 'scanFoodForNutritionFlow',
    inputSchema: ScanFoodForNutritionInputSchema,
    outputSchema: ScanFoodForNutritionOutputSchema,
  },
  async (input) => {
    const { output } = await scanFoodForNutritionPrompt(input);
    return output!;
  }
);
