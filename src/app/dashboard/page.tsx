import { BrowseRooms } from "@/components/dashboard/browse-rooms";
import { AiRecommendations } from "@/components/dashboard/ai-recommendations";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Welcome, Customer!</h1>
        <p className="text-muted-foreground">
          Explore our rooms and get personalized recommendations for your stay.
        </p>
      </div>
      <AiRecommendations />
      <BrowseRooms />
    </div>
  );
}
