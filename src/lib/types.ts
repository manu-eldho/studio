import type { Timestamp } from "firebase/firestore";

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Main Course' | 'Appetizer' | 'Dessert' | 'Drink';
  tags: string[];
}

export interface Order {
  id: string;
  date: Timestamp;
  status: 'Delivered' | 'Pending' | 'Cancelled';
  total: number;
  items: string[];
}
