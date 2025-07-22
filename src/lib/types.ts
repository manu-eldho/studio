import type { Timestamp } from "firebase/firestore";

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
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

export interface LeaveRequest {
  id: string;
  staffName: string;
  startDate: Date | Timestamp;
  endDate: Date | Timestamp;
  reason: string;
  status: 'Pending' | 'Approved' | 'Denied';
}

    