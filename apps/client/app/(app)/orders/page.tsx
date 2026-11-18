"use client";

import { Suspense, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { mockOrders } from "@/data/mockData";
import { formatCurrency, formatTime } from "@/lib/utils";
import { Search, Clock, MapPin, Phone } from "lucide-react";
import { Order, OrderStatus } from "@/types";

const statusColors: Record<OrderStatus, string> = {
  pending: "secondary",
  cooking: "warning",
  ready: "success",
  served: "info",
  assigned: "info",
  out_for_delivery: "warning",
  delivered: "success",
  completed: "default",
  cancelled: "destructive",
  voided: "destructive",
};

function OrdersContent() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = mockOrders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    const matchesType = selectedType === "all" || order.type === selectedType;
    const matchesSearch =
      searchQuery === "" ||
      order.orderNumber.toString().includes(searchQuery) ||
      order.tableName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="flex h-full flex-col">
      {/* Filters - Sticky below header */}
      <OrderFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      {/* Orders Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid gap-4 md:gap-4 lg:grid-cols-2">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-zinc-100 p-6">
              <Search className="h-12 w-12 text-zinc-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No orders found</h3>
            <p className="text-sm text-zinc-500">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const d = new Date(order.createdAt);
      const seconds = Math.floor((Date.now() - d.getTime()) / 1000);

      if (seconds < 60) {
        setTimeAgo(`${seconds}s ago`);
      } else {
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
          setTimeAgo(`${minutes}m ago`);
        } else {
          const hours = Math.floor(minutes / 60);
          if (hours < 24) {
            setTimeAgo(`${hours}h ago`);
          } else {
            const days = Math.floor(hours / 24);
            setTimeAgo(`${days}d ago`);
          }
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [order.createdAt]);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-zinc-900 text-base md:text-lg font-bold text-white">
              #{order.orderNumber}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={statusColors[order.status] as any}>
                  {order.status}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {order.type === "dine-in" ? "🍽️ Dine-in" : "🚚 Delivery"}
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs md:text-sm text-zinc-500">
                <Clock className="h-3 w-3" />
                {timeAgo || "Just now"}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg md:text-2xl font-bold">
              {formatCurrency(order.total)}
            </p>
          </div>
        </div>

        {/* Customer/Table Info */}
        <div className="mb-4 rounded-lg bg-zinc-50 p-3">
          {order.type === "dine-in" ? (
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-white p-2">
                <MapPin className="h-4 w-4 text-zinc-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{order.tableName}</p>
                <p className="text-xs text-zinc-500">
                  Waiter: {order.createdByName}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-white p-2">
                  <Phone className="h-4 w-4 text-zinc-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{order.customerName}</p>
                  <p className="text-xs text-zinc-500">{order.customerPhone}</p>
                </div>
              </div>
              {order.customerAddress && (
                <div className="flex items-start gap-2">
                  <div className="rounded-md bg-white p-2">
                    <MapPin className="h-4 w-4 text-zinc-600" />
                  </div>
                  <p className="text-xs text-zinc-500 flex-1">
                    {order.customerAddress}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Items */}
        <div className="mb-4 space-y-2">
          <p className="text-xs md:text-sm font-medium text-zinc-500">Items:</p>
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-xs md:text-sm"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="flex h-5 w-5 md:h-6 md:w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium">
                  {item.quantity}
                </span>
                <span className="truncate">{item.name}</span>
                {item.notes && (
                  <span className="text-xs text-zinc-500 hidden md:inline">
                    ({item.notes})
                  </span>
                )}
              </div>
              <span className="font-medium ml-2 flex-shrink-0">
                {formatCurrency(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="mb-4 rounded-lg bg-yellow-50 p-3">
            <p className="text-xs font-medium text-yellow-900">Note:</p>
            <p className="text-xs md:text-sm text-yellow-800">{order.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-zinc-200 pt-4">
          <div className="text-xs md:text-sm text-zinc-500">
            <p>Created: {formatTime(order.createdAt)}</p>
            {order.updatedAt !== order.createdAt && (
              <p>Updated: {formatTime(order.updatedAt)}</p>
            )}
          </div>
          <Button size="sm" className="w-full md:w-auto">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900"></div>
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
