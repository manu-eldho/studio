import Image from "next/image";
import { Dish } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { PlusCircle } from "lucide-react";

interface DishCardProps {
  dish: Dish;
}

export function DishCard({ dish }: DishCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={dish.image || "https://placehold.co/600x400.png"}
            alt={dish.name}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint="gourmet food dish"
          />
           <Badge variant="secondary" className="absolute top-2 right-2 bg-secondary/90 backdrop-blur-sm">
            {dish.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="font-headline text-xl mb-2">{dish.name}</CardTitle>
        <CardDescription>{dish.description}</CardDescription>
        <div className="mt-4 flex flex-wrap gap-2">
            {dish.tags.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-6 bg-muted/50">
        <div>
          <span className="text-2xl font-bold">${dish.price.toFixed(2)}</span>
        </div>
        <Button>
            <PlusCircle className="mr-2" />
            Add to Order
        </Button>
      </CardFooter>
    </Card>
  );
}

    