"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2, Sparkles, Wand2 } from "lucide-react";
import { getRecommendations } from "@/app/actions";
import type { RecommendActivitiesOutput } from "@/ai/flows/recommend-activities";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";

const formSchema = z.object({
  reservationDates: z.custom<DateRange>(
    (val) => val instanceof Object && "from" in val && "to" in val, { message: "Reservation dates are required." }
  ),
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
  const [recommendations, setRecommendations] = React.useState<RecommendActivitiesOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reservationDates: {
        from: new Date(),
        to: addDays(new Date(), 7),
      },
      preferences: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setRecommendations(null);

    const input = {
      reservationDates: `From ${format(values.reservationDates.from!, "yyyy-MM-dd")} to ${format(values.reservationDates.to!, "yyyy-MM-dd")}`,
      preferences: values.preferences,
      profileData: "Frequent guest, prefers quiet rooms with a view. Previously booked spa packages.",
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
            <CardTitle className="font-headline text-2xl">AI Concierge</CardTitle>
            <CardDescription>Let us tailor your perfect stay. Tell us what you're looking for.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="reservationDates"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Your Stay Dates</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} -{" "}
                                  {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick your dates</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferences & Interests</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Looking for a quiet and relaxing trip. Interested in spa treatments, fine dining, and maybe some light hiking.'"
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
            </div>
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
                <h3 className="text-xl font-headline font-bold mb-4">Your Personal Itinerary</h3>
                {loading ? (
                    <div className="grid md:grid-cols-3 gap-4">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                ) : recommendations ? (
                    <div className="grid md:grid-cols-3 gap-4">
                        <RecommendationResultCard title="Room Suggestions" content={recommendations.roomRecommendations} icon={BedDouble} />
                        <RecommendationResultCard title="Suggested Services" content={recommendations.serviceRecommendations} icon={Sparkles} />
                        <RecommendationResultCard title="Local Attractions" content={recommendations.localAttractionRecommendations} icon={Wand2} />
                    </div>
                ) : null}
            </div>
        )}

      </CardContent>
    </Card>
  );
}
