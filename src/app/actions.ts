"use server";

import { recommendDishes, RecommendDishesInput, RecommendDishesOutput } from "@/ai/flows/recommend-activities";

export async function getRecommendations(input: RecommendDishesInput): Promise<{ success: boolean; data?: RecommendDishesOutput; error?: string }> {
  try {
    const result = await recommendDishes(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting recommendations:", error);
    // Return a generic error message to the client
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
