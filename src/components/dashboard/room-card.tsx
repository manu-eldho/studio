import Image from "next/image";
import { Room } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tag } from "lucide-react";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={room.image}
            alt={room.name}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint="hotel room"
          />
           <Badge variant="destructive" className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm">
            {room.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="font-headline text-xl mb-2">{room.name}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
        <div className="mt-4 flex flex-wrap gap-2">
            {room.features.map(feature => (
                <Badge key={feature} variant="secondary">{feature}</Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-6 bg-muted/50">
        <div>
          <span className="text-2xl font-bold">${room.price}</span>
          <span className="text-sm text-muted-foreground">/night</span>
        </div>
        <Button>Book Now</Button>
      </CardFooter>
    </Card>
  );
}
