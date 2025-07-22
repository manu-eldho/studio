// src/ai/flows/recommend-activities.ts
'use server';
/**
 * @fileOverview A flow that recommends activities, services, and rooms to users.
 *
 * - recommendActivities - A function that takes in user preferences and reservation details and returns recommendations.
 * - RecommendActivitiesInput - The input type for the recommendActivities function.
 * - RecommendActivitiesOutput - The return type for the recommendActivities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendActivitiesInputSchema = z.object({
  reservationDates: z.string().describe('The start and end dates of the reservation.'),
  preferences: z.string().describe('The user preferences for activities, services, and rooms.'),
  profileData: z.string().describe('The user profile data including past stays and demographics.'),
});
export type RecommendActivitiesInput = z.infer<typeof RecommendActivitiesInputSchema>;

const RecommendActivitiesOutputSchema = z.object({
  roomRecommendations: z.string().describe('AI-powered recommendations for rooms.'),
  serviceRecommendations: z.string().describe('AI-powered recommendations for services.'),
  localAttractionRecommendations: z.string().describe('AI-powered recommendations for local attractions.'),
});
export type RecommendActivitiesOutput = z.infer<typeof RecommendActivitiesOutputSchema>;

export async function recommendActivities(input: RecommendActivitiesInput): Promise<RecommendActivitiesOutput> {
  return recommendActivitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendActivitiesPrompt',
  input: {schema: RecommendActivitiesInputSchema},
  output: {schema: RecommendActivitiesOutputSchema},
  prompt: `You are an AI travel assistant for Coral Stay. Based on the user's reservation dates, preferences, and profile data, provide personalized recommendations for rooms, services, and local attractions.

Reservation Dates: {{{reservationDates}}}
Preferences: {{{preferences}}}
Profile Data: {{{profileData}}}

Provide recommendations in a structured format.

Rooms: 
Services: 
Local Attractions:`,
});

const recommendActivitiesFlow = ai.defineFlow(
  {
    name: 'recommendActivitiesFlow',
    inputSchema: RecommendActivitiesInputSchema,
    outputSchema: RecommendActivitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
