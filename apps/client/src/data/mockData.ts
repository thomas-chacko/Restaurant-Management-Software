import { Order, MenuItem, Table, User } from "@/types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@restaurant.com",
    name: "Admin User",
    role: "admin",
    isActive: true,
  },
  {
    id: "2",
    email: "manager@restaurant.com",
    name: "John Manager",
    role: "manager",
    isActive: true,
  },
  {
    id: "3",
    email: "waiter@restaurant.com",
    name: "Sarah Waiter",
    role: "waiter",
    isActive: true,
  },
];

// Mock current user (Manager for now)
export const mockCurrentUser: User = mockUsers[1];

// Mock Tables
export const mockTables: Table[] = [
  { id: "t1", tableNumber: "1", capacity: 4, status: "occupied" },
  { id: "t2", tableNumber: "2", capacity: 2, status: "available" },
  { id: "t3", tableNumber: "3", capacity: 6, status: "occupied" },
  { id: "t4", tableNumber: "4", capacity: 4, status: "available" },
  { id: "t5", tableNumber: "5", capacity: 2, status: "occupied" },
];

// Mock Menu Items
export const mockMenuItems: MenuItem[] = [
  {
    id: "m1",
    categoryId: "c1",
    categoryName: "Main Course",
    name: "Butter Chicken",
    description: "Creamy tomato-based chicken curry",
    price: 35000, // ₹350.00
    isAvailable: true,
  },
  {
    id: "m2",
    categoryId: "c1",
    categoryName: "Main Course",
    name: "Paneer Tikka Masala",
    description: "Cottage cheese in spiced gravy",
    price: 28000,
    isAvailable: true,
  },
  {
    id: "m3",
    categoryId: "c2",
    categoryName: "Starters",
    name: "Chicken Wings",
    description: "Crispy fried chicken wings",
    price: 22000,
    isAvailable: true,
  },
  {
    id: "m4",
    categoryId: "c3",
    categoryName: "Beverages",
    name: "Fresh Lime Soda",
    description: "Refreshing lime and soda",
    price: 8000,
    isAvailable: true,
  },
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: "o1",
    orderNumber: 42,
    type: "dine-in",
    status: "cooking",
    tableId: "t1",
    tableName: "Table 1",
    items: [
      {
        id: "oi1",
        menuItemId: "m1",
        name: "Butter Chicken",
        quantity: 2,
        unitPrice: 35000,
        totalPrice: 70000,
        notes: "Medium spicy",
      },
      {
        id: "oi2",
        menuItemId: "m4",
        name: "Fresh Lime Soda",
        quantity: 2,
        unitPrice: 8000,
        totalPrice: 16000,
      },
    ],
    subtotal: 86000,
    discount: 0,
    tax: 15480, // 18% GST
    total: 101480,
    notes: "Extra plates needed",
    createdBy: "3",
    createdByName: "Sarah Waiter",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "o2",
    orderNumber: 43,
    type: "delivery",
    status: "ready",
    customerName: "Rahul Sharma",
    customerPhone: "+91 98765 43210",
    customerAddress: "123, MG Road, Bangalore",
    items: [
      {
        id: "oi3",
        menuItemId: "m2",
        name: "Paneer Tikka Masala",
        quantity: 1,
        unitPrice: 28000,
        totalPrice: 28000,
      },
      {
        id: "oi4",
        menuItemId: "m3",
        name: "Chicken Wings",
        quantity: 1,
        unitPrice: 22000,
        totalPrice: 22000,
      },
    ],
    subtotal: 50000,
    discount: 0,
    tax: 9000,
    total: 59000,
    createdBy: "2",
    createdByName: "John Manager",
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "o3",
    orderNumber: 44,
    type: "dine-in",
    status: "pending",
    tableId: "t3",
    tableName: "Table 3",
    items: [
      {
        id: "oi5",
        menuItemId: "m1",
        name: "Butter Chicken",
        quantity: 1,
        unitPrice: 35000,
        totalPrice: 35000,
      },
    ],
    subtotal: 35000,
    discount: 0,
    tax: 6300,
    total: 41300,
    createdBy: "3",
    createdByName: "Sarah Waiter",
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "o4",
    orderNumber: 45,
    type: "dine-in",
    status: "ready",
    tableId: "t5",
    tableName: "Table 5",
    items: [
      {
        id: "oi6",
        menuItemId: "m2",
        name: "Paneer Tikka Masala",
        quantity: 2,
        unitPrice: 28000,
        totalPrice: 56000,
      },
      {
        id: "oi7",
        menuItemId: "m4",
        name: "Fresh Lime Soda",
        quantity: 3,
        unitPrice: 8000,
        totalPrice: 24000,
      },
    ],
    subtotal: 80000,
    discount: 0,
    tax: 14400,
    total: 94400,
    createdBy: "3",
    createdByName: "Sarah Waiter",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
];
