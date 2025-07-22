// src/ai/flows/recommend-dishes.ts
'use server';
/**
 * @fileOverview A flow that recommends dishes to users.
 *
 * - recommendDishes - A function that takes in user preferences and returns recommendations.
 * - RecommendDishesInput - The input type for the recommendDishes function.
 * - RecommendDishesOutput - The return type for the recommendDishes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendDishesInputSchema = z.object({
  preferences: z.string().describe('The user preferences for dishes, flavors, and ingredients.'),
  profileData: z.string().describe('The user profile data including past orders and dietary restrictions.'),
});
export type RecommendDishesInput = z.infer<typeof RecommendDishesInputSchema>;

const RecommendDishesOutputSchema = z.object({
  dishRecommendations: z.string().describe('AI-powered recommendations for main courses.'),
  appetizerRecommendations: z.string().describe('AI-powered recommendations for appetizers.'),
  drinkRecommendations: z.string().describe('AI-powered recommendations for drinks.'),
});
export type RecommendDishesOutput = z.infer<typeof RecommendDishesOutputSchema>;

export async function recommendDishes(input: RecommendDishesInput): Promise<RecommendDishesOutput> {
  return recommendDishesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendDishesPrompt',
  input: {schema: RecommendDishesInputSchema},
  output: {schema: RecommendDishesOutputSchema},
  prompt: `You are an AI sommelier for The Golden Spoon. Based on the user's preferences and profile data, provide personalized recommendations for dishes, appetizers, and drinks.

Preferences: {{{preferences}}}
Profile Data: {{{profileData}}}

Provide recommendations in a structured format.

Dishes: 
Appetizers: 
Drinks:`,
});

const recommendDishesFlow = ai.defineFlow(
  {
    name: 'recommendDishesFlow',
    inputSchema: RecommendDishesInputSchema,
    outputSchema: RecommendDishesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
