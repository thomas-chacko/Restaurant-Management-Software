'use client';

import { useState } from 'react';
import { KitchenOrderCard } from '@/components/kitchen/KitchenOrderCard';
import { mockKitchenOrders } from '@/mock/kitchenData';
import { KitchenOrder, OrderStatus } from '@/types/kitchen';
import { Badge } from '@/components/ui/badge';

export default function KitchenPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>(mockKitchenOrders);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          const updates: Partial<KitchenOrder> = { status: newStatus };
          
          if (newStatus === 'preparing' && !order.preparingStartedAt) {
            updates.preparingStartedAt = new Date();
          } else if (newStatus === 'ready' && !order.readyAt) {
            updates.readyAt = new Date();
          } else if (newStatus === 'served') {
            // Remove served orders after a short delay
            setTimeout(() => {
              setOrders(prev => prev.filter(o => o.id !== orderId));
            }, 500);
          }
          
          return { ...order, ...updates };
        }
        return order;
      })
    );
  };

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter(order => order.status === status);
  };

  const newOrders = getOrdersByStatus('new');
  const preparingOrders = getOrdersByStatus('preparing');
  const readyOrders = getOrdersByStatus('ready');

  const getStatusLabel = (status: OrderStatus, count: number) => {
    const labels: Record<OrderStatus, string> = {
      new: 'New Orders',
      preparing: 'Preparing',
      ready: 'Ready to Serve',
      served: 'Served'
    };
    return `${labels[status]} (${count})`;
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header Stats */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Kitchen Queue</h1>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default" className="text-sm px-4 py-2">
            Total: {orders.length}
          </Badge>
          <Badge variant="outline" className="text-sm px-4 py-2 bg-blue-50 border-blue-200 text-blue-700">
            New: {newOrders.length}
          </Badge>
          <Badge variant="outline" className="text-sm px-4 py-2 bg-amber-50 border-amber-200 text-amber-700">
            Preparing: {preparingOrders.length}
          </Badge>
          <Badge variant="outline" className="text-sm px-4 py-2 bg-green-50 border-green-200 text-green-700">
            Ready: {readyOrders.length}
          </Badge>
        </div>
      </div>

      {/* Order Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Orders */}
        <div>
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            {getStatusLabel('new', newOrders.length)}
          </h2>
          <div className="space-y-4">
            {newOrders.length === 0 ? (
              <div className="text-center py-12 text-zinc-400">
                <p>No new orders</p>
              </div>
            ) : (
              newOrders.map(order => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>

        {/* Preparing Orders */}
        <div>
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            {getStatusLabel('preparing', preparingOrders.length)}
          </h2>
          <div className="space-y-4">
            {preparingOrders.length === 0 ? (
              <div className="text-center py-12 text-zinc-400">
                <p>No orders in preparation</p>
              </div>
            ) : (
              preparingOrders.map(order => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>

        {/* Ready Orders */}
        <div>
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            {getStatusLabel('ready', readyOrders.length)}
          </h2>
          <div className="space-y-4">
            {readyOrders.length === 0 ? (
              <div className="text-center py-12 text-zinc-400">
                <p>No orders ready</p>
              </div>
            ) : (
              readyOrders.map(order => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
