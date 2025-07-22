"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles, Wand2, Utensils, GlassWater, Beef } from "lucide-react";
import { getRecommendations } from "@/app/actions";
import type { RecommendDishesOutput } from "@/ai/flows/recommend-activities";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";

const formSchema = z.object({
  preferences: z.string().min(10, { message: "Please describe your preferences in at least 10 characters." }),
});

const RecommendationResultCard = ({ title, content, icon: Icon }: { title: string; content: string; icon: React.ElementType }) => {
  if (!content) return null;
  
  const items = content.split('\n').filter(item => item.trim() !== '');

  return (
    <Card className="bg-card/50">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
           <Icon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2">
            {items.map((item, index) => <li key={index}>{item.replace(/^\d+\.\s*/, '')}</li>)}
        </ul>
      </CardContent>
    </Card>
  );
};

export function AiRecommendations() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [recommendations, setRecommendations] = React.useState<RecommendDishesOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferences: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setRecommendations(null);

    const input = {
      preferences: values.preferences,
      profileData: "Frequent customer, prefers spicy food. No seafood allergies.",
    };

    const result = await getRecommendations(input);

    if (result.success && result.data) {
      setRecommendations(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to get recommendations.",
      });
    }

    setLoading(false);
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="font-headline text-2xl">AI Sommelier</CardTitle>
            <CardDescription>Let us recommend the perfect meal for you. Tell us what you're craving.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tastes & Preferences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'I'm looking for something spicy and savory. I love chicken and I'm open to trying new things. Maybe a refreshing drink to go with it.'"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                    <FormDescription>
                      The more details you provide, the better our recommendations will be.
                    </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} size="lg" className="w-full md:w-auto">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Recommendations
            </Button>
          </form>
        </Form>
        
        {(loading || recommendations) && (
            <div className="mt-8 pt-8 border-t">
                <h3 className="text-xl font-headline font-bold mb-4">Your Personal Menu</h3>
                {loading ? (
                    <div className="grid md:grid-cols-3 gap-4">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                ) : recommendations ? (
                    <div className="grid md:grid-cols-3 gap-4">
                        <RecommendationResultCard title="Main Dish Suggestions" content={recommendations.dishRecommendations} icon={Beef} />
                        <RecommendationResultCard title="Appetizer Suggestions" content={recommendations.appetizerRecommendations} icon={Utensils} />
                        <RecommendationResultCard title="Drink Pairings" content={recommendations.drinkRecommendations} icon={GlassWater} />
                    </div>
                ) : null}
            </div>
        )}

      </CardContent>
    </Card>
  );
}
