"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, DollarSign, Clock, TrendingUp } from "lucide-react";
import { mockOrders } from "@/data/mockData";
import { formatCurrency, formatTime } from "@/lib/utils";

export default function ManagerDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  // Calculate stats from mock data
  const activeOrders = mockOrders.filter(
    (o) => !["completed", "cancelled", "voided"].includes(o.status)
  );
  const todayRevenue = mockOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = mockOrders.filter((o) => o.status === "pending").length;
  const readyOrders = mockOrders.filter((o) => o.status === "ready").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "cooking":
        return "warning";
      case "ready":
        return "success";
      case "served":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Active Orders
            </CardTitle>
            <ShoppingBag className="h-5 w-5 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeOrders.length}</div>
            <p className="mt-1 text-xs text-zinc-500">
              {pendingOrders} pending, {readyOrders} ready
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Today&apos;s Revenue
            </CardTitle>
            <DollarSign className="h-5 w-5 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(todayRevenue)}</div>
            <p className="mt-1 text-xs text-zinc-500">
              From {mockOrders.length} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Avg. Prep Time
            </CardTitle>
            <Clock className="h-5 w-5 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18m</div>
            <p className="mt-1 text-xs text-zinc-500">-2m from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Growth
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+12.5%</div>
            <p className="mt-1 text-xs text-zinc-500">vs last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 font-bold text-zinc-900">
                    #{order.orderNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {order.type === "dine-in"
                          ? order.tableName
                          : order.customerName}
                      </p>
                      <Badge variant={getStatusColor(order.status) as any}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-500">
                      {order.items.length} items • {mounted ? formatTime(order.createdAt) : '--:--'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(order.total)}</p>
                  <p className="text-sm text-zinc-500">{order.type}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
