import { RoomCard } from "./room-card";
import { Room } from "@/lib/types";
import { DatePickerWithRange } from "../ui/date-picker-with-range";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Filter } from "lucide-react";

const rooms: Room[] = [
  {
    id: "1",
    name: "Ocean View Suite",
    description: "Spacious suite with a breathtaking view of the ocean.",
    price: 350,
    image: "https://placehold.co/600x400/FF6B6B/FFFFFF",
    type: "Suite",
    features: ["King Bed", "Ocean View", "Balcony", "Jacuzzi"],
  },
  {
    id: "2",
    name: "Deluxe King Room",
    description: "A comfortable room with a king-sized bed.",
    price: 180,
    image: "https://placehold.co/600x400/FFD93D/FFFFFF",
    type: "Double",
    features: ["King Bed", "City View"],
  },
  {
    id: "3",
    name: "Standard Queen Room",
    description: "Perfect for solo travelers or couples.",
    price: 120,
    image: "https://placehold.co/600x400/6BCB77/FFFFFF",
    type: "Single",
    features: ["Queen Bed", "Garden View"],
  },
  {
    id: "4",
    name: "Family Garden Bungalow",
    description: "A spacious bungalow perfect for families, with a private garden.",
    price: 280,
    image: "https://placehold.co/600x400/4D96FF/FFFFFF",
    type: "Suite",
    features: ["Two Queen Beds", "Garden View", "Kitchenette"],
  },
  {
    id: "5",
    name: "Honeymoon Suite",
    description: "Romantic suite with premium amenities and ultimate privacy.",
    price: 450,
    image: "https://placehold.co/600x400/f87171/FFFFFF",
    type: "Suite",
    features: ["King Bed", "Ocean View", "Private Pool"],
  },
  {
    id: "6",
    name: "Accessible Twin Room",
    description: "Designed for comfort and accessibility.",
    price: 150,
    image: "https://placehold.co/600x400/34d399/FFFFFF",
    type: "Double",
    features: ["Two Twin Beds", "Accessible Bathroom"],
  },
];

export function BrowseRooms() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-headline">Explore Our Rooms</h2>
        <p className="text-muted-foreground">Find the perfect room for your stay.</p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <DatePickerWithRange className="w-full md:w-auto" />
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="double">Double</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </section>
  );
}
