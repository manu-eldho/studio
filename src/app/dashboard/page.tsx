
"use client";
import { AiRecommendations } from "@/components/dashboard/ai-recommendations";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Welcome, Foodie!</h1>
        <p className="text-muted-foreground">
          Explore our menu and find your next favorite meal, or get a personalized AI recommendation.
        </p>
      </div>
      <AiRecommendations />
    </div>
  );
}
