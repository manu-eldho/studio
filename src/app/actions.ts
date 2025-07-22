"use server";

import { recommendActivities, RecommendActivitiesInput, RecommendActivitiesOutput } from "@/ai/flows/recommend-activities";

export async function getRecommendations(input: RecommendActivitiesInput): Promise<{ success: boolean; data?: RecommendActivitiesOutput; error?: string }> {
  try {
    const result = await recommendActivities(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting recommendations:", error);
    // Return a generic error message to the client
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
