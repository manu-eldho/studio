
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Welcome, Foodie!</h1>
        <p className="text-muted-foreground">
          Explore our menu and find your next favorite meal.
        </p>
      </div>
      <Card className="shadow-lg bg-gradient-to-br from-primary/10 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <UtensilsCrossed className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="font-headline text-2xl">Ready to Order?</CardTitle>
              <CardDescription>Our full menu is just one click away. Find delicious meals prepared fresh just for you.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <Link href="/dashboard/menu">
                <Button size="lg">Browse Full Menu</Button>
            </Link>
        </CardContent>
      </Card>
    </div>
  );
}
