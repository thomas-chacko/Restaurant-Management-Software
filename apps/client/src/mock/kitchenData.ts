import { KitchenOrder } from '@/types/kitchen';

export const mockKitchenOrders: KitchenOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD-1001',
    tableNumber: 'T-05',
    status: 'new',
    priority: 'urgent',
    items: [
      { id: '1', name: 'Butter Chicken', quantity: 2, category: 'Main Course', notes: 'Extra spicy' },
      { id: '2', name: 'Garlic Naan', quantity: 4, category: 'Breads' },
      { id: '3', name: 'Raita', quantity: 1, category: 'Sides' }
    ],
    createdAt: new Date(Date.now() - 3 * 60000), // 3 minutes ago
    waiterName: 'Sarah',
    specialInstructions: 'Customer has nut allergy'
  },
  {
    id: '2',
    orderNumber: 'ORD-1002',
    tableNumber: 'T-12',
    status: 'new',
    priority: 'normal',
    items: [
      { id: '4', name: 'Paneer Tikka', quantity: 1, category: 'Starters' },
      { id: '5', name: 'Veg Biryani', quantity: 2, category: 'Main Course' }
    ],
    createdAt: new Date(Date.now() - 1 * 60000), // 1 minute ago
    waiterName: 'Mike'
  },
  {
    id: '3',
    orderNumber: 'ORD-0998',
    tableNumber: 'T-08',
    status: 'preparing',
    priority: 'normal',
    items: [
      { id: '6', name: 'Dal Makhani', quantity: 1, category: 'Main Course' },
      { id: '7', name: 'Jeera Rice', quantity: 2, category: 'Rice' },
      { id: '8', name: 'Tandoori Roti', quantity: 3, category: 'Breads' }
    ],
    createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    preparingStartedAt: new Date(Date.now() - 8 * 60000), // Started 8 minutes ago
    waiterName: 'Sarah'
  },
  {
    id: '4',
    orderNumber: 'ORD-0999',
    tableNumber: 'T-03',
    status: 'preparing',
    priority: 'urgent',
    items: [
      { id: '9', name: 'Chicken Tikka Masala', quantity: 1, category: 'Main Course', notes: 'Mild' },
      { id: '10', name: 'Butter Naan', quantity: 2, category: 'Breads' }
    ],
    createdAt: new Date(Date.now() - 12 * 60000), // 12 minutes ago
    preparingStartedAt: new Date(Date.now() - 5 * 60000), // Started 5 minutes ago
    waiterName: 'Mike',
    specialInstructions: 'Birthday celebration - please rush'
  },
  {
    id: '5',
    orderNumber: 'ORD-0997',
    tableNumber: 'T-15',
    status: 'ready',
    priority: 'normal',
    items: [
      { id: '11', name: 'Malai Kofta', quantity: 1, category: 'Main Course' },
      { id: '12', name: 'Plain Naan', quantity: 2, category: 'Breads' },
      { id: '13', name: 'Mango Lassi', quantity: 2, category: 'Beverages' }
    ],
    createdAt: new Date(Date.now() - 20 * 60000), // 20 minutes ago
    preparingStartedAt: new Date(Date.now() - 15 * 60000),
    readyAt: new Date(Date.now() - 2 * 60000), // Ready 2 minutes ago
    waiterName: 'Sarah'
  },
  {
    id: '6',
    orderNumber: 'ORD-0996',
    tableNumber: 'T-07',
    status: 'ready',
    priority: 'normal',
    items: [
      { id: '14', name: 'Aloo Gobi', quantity: 1, category: 'Main Course' },
      { id: '15', name: 'Pulao', quantity: 1, category: 'Rice' }
    ],
    createdAt: new Date(Date.now() - 18 * 60000), // 18 minutes ago
    preparingStartedAt: new Date(Date.now() - 13 * 60000),
    readyAt: new Date(Date.now() - 1 * 60000), // Ready 1 minute ago
    waiterName: 'Mike'
  }
];
