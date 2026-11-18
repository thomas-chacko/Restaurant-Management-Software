'use client';

import { KitchenOrder } from '@/types/kitchen';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, ChefHat, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface KitchenOrderCardProps {
  order: KitchenOrder;
  onStatusChange: (orderId: string, newStatus: 'preparing' | 'ready' | 'served') => void;
}

export function KitchenOrderCard({ order, onStatusChange }: KitchenOrderCardProps) {
  const [timeElapsed, setTimeElapsed] = useState('');
  const [overtime, setOvertime] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const createdTime = order.createdAt.getTime();
      const diff = Math.floor((now - createdTime) / 60000); // minutes

      if (diff < 1) {
        setTimeElapsed('Just now');
      } else if (diff === 1) {
        setTimeElapsed('1 min ago');
      } else {
        setTimeElapsed(`${diff} mins ago`);
      }

      setOvertime(diff > 15); // Over 15 minutes
    };

    updateTime();
    const interval = setInterval(updateTime, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [order.createdAt]);

  const getStatusColor = () => {
    switch (order.status) {
      case 'new':
        return 'bg-blue-500';
      case 'preparing':
        return 'bg-amber-500';
      case 'ready':
        return 'bg-green-500';
      default:
        return 'bg-zinc-500';
    }
  };

  const getNextAction = () => {
    switch (order.status) {
      case 'new':
        return { label: 'Start Preparing', icon: ChefHat, status: 'preparing' as const };
      case 'preparing':
        return { label: 'Mark Ready', icon: CheckCircle, status: 'ready' as const };
      case 'ready':
        return { label: 'Mark Served', icon: CheckCircle, status: 'served' as const };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <Card className={`${order.priority === 'urgent' ? 'border-l-4 border-l-red-500' : ''}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
              {order.priority === 'urgent' && (
                <Badge variant="destructive" className="text-xs">
                  Urgent
                </Badge>
              )}
            </div>
            <p className="text-sm text-zinc-500">Table {order.tableNumber} • {order.waiterName}</p>
          </div>
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
        </div>

        {/* Time Info */}
        <div className={`flex items-center gap-2 mb-3 text-sm ${overtime ? 'text-red-600 font-medium' : 'text-zinc-600'}`}>
          {overtime ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          <span>{timeElapsed}</span>
          {overtime && <span className="text-xs">(Overtime)</span>}
        </div>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded text-sm">
            <p className="font-medium text-amber-900 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Special Instructions
            </p>
            <p className="text-amber-800 mt-1">{order.specialInstructions}</p>
          </div>
        )}

        {/* Items */}
        <div className="space-y-2 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-start text-sm">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.quantity}x</span>
                  <span>{item.name}</span>
                </div>
                {item.notes && (
                  <p className="text-xs text-zinc-500 ml-8 mt-0.5">Note: {item.notes}</p>
                )}
              </div>
              <span className="text-xs text-zinc-400 ml-2">{item.category}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {nextAction && (
          <Button
            onClick={() => onStatusChange(order.id, nextAction.status)}
            className="w-full"
            variant={order.status === 'preparing' ? 'default' : 'outline'}
          >
            <nextAction.icon className="w-4 h-4 mr-2" />
            {nextAction.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
