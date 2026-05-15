'use server';
/**
 * @fileOverview Provides personalized nutritional advice and meal suggestions based on a user's food history.
 *
 * - getPersonalizedNutritionSuggestions - A function that handles the generation of personalized nutrition advice.
 * - GetPersonalizedNutritionSuggestionsInput - The input type for the getPersonalizedNutritionSuggestions function.
 * - GetPersonalizedNutritionSuggestionsOutput - The return type for the getPersonalizedNutritionSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetPersonalizedNutritionSuggestionsInputSchema = z.object({
  foodHistory: z.array(
    z.object({
      name: z.string().describe('The name of the food item.'),
      nutritionInfo: z.object({
        calories: z.number().describe('Calories in kcal.'),
        protein: z.number().describe('Protein in grams.'),
        carbohydrates: z.number().describe('Carbohydrates in grams.'),
        fat: z.number().describe('Fat in grams.'),
      }).describe('Detailed nutritional information for the food item.'),
    })
  ).describe('A list of previously scanned food items with their nutritional information.'),
});
export type GetPersonalizedNutritionSuggestionsInput = z.infer<typeof GetPersonalizedNutritionSuggestionsInputSchema>;

const GetPersonalizedNutritionSuggestionsOutputSchema = z.object({
  advice: z.string().describe('Personalized nutritional advice based on the food history.'),
  mealSuggestions: z.array(z.string()).describe('A list of meal suggestions based on the advice.'),
});
export type GetPersonalizedNutritionSuggestionsOutput = z.infer<typeof GetPersonalizedNutritionSuggestionsOutputSchema>;

export async function getPersonalizedNutritionSuggestions(input: GetPersonalizedNutritionSuggestionsInput): Promise<GetPersonalizedNutritionSuggestionsOutput> {
  return getPersonalizedNutritionSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedNutritionSuggestionsPrompt',
  input: {schema: GetPersonalizedNutritionSuggestionsInputSchema},
  output: {schema: GetPersonalizedNutritionSuggestionsOutputSchema},
  prompt: `You are an AI nutrition expert named NutriScan. Your goal is to provide personalized nutritional advice and meal suggestions based on a user's food history.

Here is the user's food history:
{{#each foodHistory}}
- Food: {{{name}}}
  Nutrition:
    Calories: {{{nutritionInfo.calories}}} kcal
    Protein: {{{nutritionInfo.protein}}} g
    Carbohydrates: {{{nutritionInfo.carbohydrates}}} g
    Fat: {{{nutritionInfo.fat}}} g
{{/each}}

Based on this history, please provide:
1. Personalized nutritional advice to help the user make healthier dietary choices.
2. A list of 3-5 meal suggestions that align with your advice.

Please format your response as a JSON object with the following structure: {"advice": "...", "mealSuggestions": [...]} `,
});

const getPersonalizedNutritionSuggestionsFlow = ai.defineFlow(
  {
    name: 'getPersonalizedNutritionSuggestionsFlow',
    inputSchema: GetPersonalizedNutritionSuggestionsInputSchema,
    outputSchema: GetPersonalizedNutritionSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
