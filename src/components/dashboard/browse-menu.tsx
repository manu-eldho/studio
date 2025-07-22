import { DishCard } from "./dish-card";
import { Dish } from "@/lib/types";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Search } from "lucide-react";

const menu: Dish[] = [
  {
    id: "1",
    name: "Spicy Szechuan Chicken",
    description: "A fiery classic with tender chicken, peanuts, and chili peppers.",
    price: 18.50,
    image: "https://placehold.co/600x400/c2410c/FFFFFF",
    category: "Main Course",
    tags: ["Spicy", "Chicken", "Popular"],
  },
  {
    id: "2",
    name: "Classic Margherita Pizza",
    description: "Simple yet delicious with fresh mozzarella, tomatoes, and basil.",
    price: 14.00,
    image: "https://placehold.co/600x400/facc15/FFFFFF",
    category: "Main Course",
    tags: ["Vegetarian", "Italian"],
  },
  {
    id: "3",
    name: "Crispy Spring Rolls",
    description: "Golden-fried rolls filled with vegetables and glass noodles.",
    price: 8.00,
    image: "https://placehold.co/600x400/fbbf24/FFFFFF",
    category: "Appetizer",
    tags: ["Vegetarian", "Starter"],
  },
  {
    id: "4",
    name: "Gourmet Truffle Burger",
    description: "Juicy beef patty with truffle aioli, arugula, and swiss cheese.",
    price: 22.00,
    image: "https://placehold.co/600x400/ea580c/FFFFFF",
    category: "Main Course",
    tags: ["Beef", "Gourmet"],
  },
  {
    id: "5",
    name: "Decadent Chocolate Lava Cake",
    description: "Warm, molten chocolate cake served with a scoop of vanilla ice cream.",
    price: 9.50,
    image: "https://placehold.co/600x400/d97706/FFFFFF",
    category: "Dessert",
    tags: ["Sweet", "Chocolate"],
  },
  {
    id: "6",
    name: "Refreshing Mojito",
    description: "A classic Cuban cocktail with mint, lime, and rum.",
    price: 12.00,
    image: "https://placehold.co/600x400/a3e635/FFFFFF",
    category: "Drink",
    tags: ["Cocktail", "Alcoholic"],
  },
];

export function BrowseMenu() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-headline">Explore Our Menu</h2>
        <p className="text-muted-foreground">Find the perfect dish to satisfy your cravings.</p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-auto md:flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search for a dish..." className="pl-8 w-full" />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main Course</SelectItem>
                <SelectItem value="appetizer">Appetizer</SelectItem>
                <SelectItem value="dessert">Dessert</SelectItem>
                <SelectItem value="drink">Drink</SelectItem>
              </SelectContent>
            </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </section>
  );
}
