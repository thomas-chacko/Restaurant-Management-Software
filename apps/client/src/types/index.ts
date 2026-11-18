// User & Auth Types
export type Role = "admin" | "manager" | "waiter" | "kitchen" | "delivery";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  isActive: boolean;
}

// Order Types
export type OrderType = "dine-in" | "delivery";

export type OrderStatus =
  | "pending"
  | "cooking"
  | "ready"
  | "served"
  | "assigned"
  | "out_for_delivery"
  | "delivered"
  | "completed"
  | "cancelled"
  | "voided";

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  type: OrderType;
  status: OrderStatus;
  tableId?: string;
  tableName?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountReason?: string;
  tax: number;
  total: number;
  paymentMethod?: string;
  paymentStatus?: string;
  notes?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// Menu Types
export interface Category {
  id: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  minStockLevel?: number;
}

// Table Types
export type TableStatus = "available" | "occupied" | "reserved";

export interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  status: TableStatus;
}

// Delivery Types
export interface DeliveryAssignment {
  id: string;
  orderId: string;
  deliveryUserId: string;
  deliveryUserName: string;
  assignedBy: string;
  assignedAt: string;
  isActive: boolean;
}

export interface CashHandover {
  id: string;
  deliveryUserId: string;
  deliveryUserName: string;
  managerId: string;
  amount: number;
  orderIds: string[];
  verified: boolean;
  notes?: string;
  createdAt: string;
}

// Stock Types
export type StockMovementType = "purchase" | "consumption" | "waste" | "adjustment";

export interface StockMovement {
  id: string;
  menuItemId: string;
  menuItemName: string;
  type: StockMovementType;
  quantity: number;
  reason?: string;
  referenceId?: string;
  createdBy: string;
  createdAt: string;
}
