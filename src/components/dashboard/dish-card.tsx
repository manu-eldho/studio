
"use client";

import Image from "next/image";
import React, { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Dish } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Loader2, PlusCircle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";


interface DishCardProps {
  dish: Dish;
}

export function DishCard({ dish }: DishCardProps) {
  const { toast } = useToast();
  const [isOrdering, setIsOrdering] = useState(false);

  const handlePlaceOrder = async () => {
    setIsOrdering(true);
    try {
        await addDoc(collection(db, "orders"), {
            date: Timestamp.now(),
            status: 'Pending',
            total: dish.price,
            items: [dish.name],
            customerName: "Jane Doe", // Hardcoded for now
            paymentStatus: 'Unpaid',
            reviewed: false
        });
        toast({
            title: "Order Placed!",
            description: `${dish.name} has been added to your orders.`,
        });
    } catch (error) {
        console.error("Error placing order:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to place your order.",
        });
    } finally {
        setIsOrdering(false);
    }
  }


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
            {Array.isArray(dish.tags) && dish.tags.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-6 bg-muted/50">
        <div>
          <span className="text-2xl font-bold">${dish.price.toFixed(2)}</span>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={isOrdering}>
                {isOrdering ? <Loader2 className="mr-2 animate-spin"/> : <PlusCircle className="mr-2" />}
                Add to Order
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Your Order</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to order one {dish.name} for ${dish.price.toFixed(2)}? This will be added to your orders with a "Pay Later" option.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handlePlaceOrder} disabled={isOrdering}>
                {isOrdering ? <Loader2 className="mr-2 animate-spin"/> : null}
                Place Order
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
