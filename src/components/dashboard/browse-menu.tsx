
"use client";

import { useState } from "react";
import { DishCard } from "./dish-card";
import { Dish } from "@/lib/types";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface BrowseMenuProps {
  menu: Dish[];
}

export function BrowseMenu({ menu }: BrowseMenuProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  const filteredMenu = menu.filter(dish => {
    const matchesCategory = category === 'all' || dish.category === category;
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                <Input 
                    placeholder="Search for a dish..." 
                    className="pl-8 w-full" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select onValueChange={setCategory} defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Main Course">Main Course</SelectItem>
                <SelectItem value="Appetizer">Appetizer</SelectItem>
                <SelectItem value="Dessert">Dessert</SelectItem>
                <SelectItem value="Drink">Drink</SelectItem>
              </SelectContent>
            </Select>
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
            {filteredMenu.map((dish) => (
               <motion.div
                key={dish.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <DishCard dish={dish} />
              </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>
       {filteredMenu.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-semibold">No dishes found</p>
            <p>Try adjusting your search or filter.</p>
          </div>
        )}
    </section>
  );
}
