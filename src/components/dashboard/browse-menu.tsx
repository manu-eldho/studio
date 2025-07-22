import { DishCard } from "./dish-card";
import { Dish } from "@/lib/types";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Search } from "lucide-react";

interface BrowseMenuProps {
  menu: Dish[];
}

export function BrowseMenu({ menu }: BrowseMenuProps) {
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
