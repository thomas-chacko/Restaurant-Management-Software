export type OrderStatus = 'new' | 'preparing' | 'ready' | 'served';
export type OrderPriority = 'normal' | 'urgent';

export interface KitchenOrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
}

export interface KitchenOrder {
  id: string;
  orderNumber: string;
  tableNumber: string;
  status: OrderStatus;
  priority: OrderPriority;
  items: KitchenOrderItem[];
  createdAt: Date;
  preparingStartedAt?: Date;
  readyAt?: Date;
  waiterName: string;
  specialInstructions?: string;
}
