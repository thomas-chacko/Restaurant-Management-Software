"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Phone, Bike } from "lucide-react";

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  items: number;
  amount: number;
  status: "pending" | "assigned" | "picked-up" | "delivered";
  rider?: string;
  createdAt: Date;
}

const mockOrders: DeliveryOrder[] = [
  {
    id: "1",
    orderNumber: "ORD-1001",
    customerName: "Rajesh Kumar",
    phone: "+91 98765 43210",
    address: "123, MG Road, Bangalore - 560001",
    items: 3,
    amount: 125000,
    status: "pending",
    createdAt: new Date(Date.now() - 5 * 60000),
  },
  {
    id: "2",
    orderNumber: "ORD-1002",
    customerName: "Priya Sharma",
    phone: "+91 98765 43211",
    address: "456, Brigade Road, Bangalore - 560002",
    items: 2,
    amount: 85000,
    status: "assigned",
    rider: "Ramesh (Bike #12)",
    createdAt: new Date(Date.now() - 15 * 60000),
  },
  {
    id: "3",
    orderNumber: "ORD-1003",
    customerName: "Amit Patel",
    phone: "+91 98765 43212",
    address: "789, Koramangala, Bangalore - 560034",
    items: 4,
    amount: 156000,
    status: "picked-up",
    rider: "Suresh (Bike #05)",
    createdAt: new Date(Date.now() - 25 * 60000),
  },
];

const mockRiders = [
  { id: "1", name: "Ramesh", bike: "#12", status: "busy" },
  { id: "2", name: "Suresh", bike: "#05", status: "busy" },
  { id: "3", name: "Kumar", bike: "#08", status: "available" },
  { id: "4", name: "Vijay", bike: "#15", status: "available" },
];

export default function DeliveryPage() {
  const [orders, setOrders] = useState<DeliveryOrder[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");

  const formatCurrency = (paise: number) => `₹${(paise / 100).toFixed(2)}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "assigned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "picked-up":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-zinc-100 text-zinc-800 border-zinc-200";
    }
  };

  const handleAssignRider = (orderId: string, rider: string) => {
    setOrders(orders.map(o => 
      o.id === orderId 
        ? { ...o, status: "assigned" as const, rider }
        : o
    ));
  };

  const handleStatusChange = (orderId: string, newStatus: DeliveryOrder["status"]) => {
    setOrders(orders.map(o => 
      o.id === orderId 
        ? { ...o, status: newStatus }
        : o
    ));
  };

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.phone.includes(searchQuery)
  );

  const stats = {
    pending: orders.filter(o => o.status === "pending").length,
    assigned: orders.filter(o => o.status === "assigned").length,
    pickedUp: orders.filter(o => o.status === "picked-up").length,
    delivered: orders.filter(o => o.status === "delivered").length,
  };

  return (
    <div className="p-4 md:p-6">
      {/* Stats */}
      <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-zinc-500 mb-1">Pending</div>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-zinc-500 mb-1">Assigned</div>
            <div className="text-2xl font-bold text-blue-600">{stats.assigned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-zinc-500 mb-1">Out for Delivery</div>
            <div className="text-2xl font-bold text-purple-600">{stats.pickedUp}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-zinc-500 mb-1">Delivered Today</div>
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by order, customer or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 py-2 pl-10 pr-4 text-sm transition-colors hover:border-zinc-300 focus:border-zinc-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-zinc-400" />
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-zinc-500">{order.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600">
                      <Phone className="h-4 w-4 text-zinc-400" />
                      <span>{order.phone}</span>
                    </div>
                    {order.rider && (
                      <div className="flex items-center gap-2 text-zinc-600">
                        <Bike className="h-4 w-4 text-zinc-400" />
                        <span>{order.rider}</span>
                      </div>
                    )}
                    <div className="pt-2 flex justify-between border-t border-zinc-200">
                      <span className="text-zinc-600">{order.items} items</span>
                      <span className="font-bold">{formatCurrency(order.amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 lg:w-48">
                  {order.status === "pending" && (
                    <div className="space-y-2">
                      <p className="text-xs text-zinc-500">Assign to rider:</p>
                      {mockRiders.filter(r => r.status === "available").map(rider => (
                        <Button
                          key={rider.id}
                          onClick={() => handleAssignRider(order.id, `${rider.name} (Bike ${rider.bike})`)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          {rider.name} {rider.bike}
                        </Button>
                      ))}
                    </div>
                  )}
                  {order.status === "assigned" && (
                    <Button onClick={() => handleStatusChange(order.id, "picked-up")} className="w-full">
                      Mark Picked Up
                    </Button>
                  )}
                  {order.status === "picked-up" && (
                    <Button onClick={() => handleStatusChange(order.id, "delivered")} className="w-full">
                      Mark Delivered
                    </Button>
                  )}
                  {order.status === "delivered" && (
                    <Badge variant="outline" className="text-sm py-2 justify-center">
                      ✓ Completed
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="py-12 text-center text-zinc-400">
          <p>No delivery orders found</p>
        </div>
      )}
    </div>
  );
}
