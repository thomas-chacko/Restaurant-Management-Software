"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, DollarSign } from "lucide-react";

interface Table {
  id: string;
  name: string;
  capacity: number;
  status: "available" | "occupied" | "reserved";
  currentOrder?: {
    orderNumber: string;
    guests: number;
    startTime: Date;
    amount: number;
  };
}

const mockTables: Table[] = [
  {
    id: "1",
    name: "T-01",
    capacity: 2,
    status: "available",
  },
  {
    id: "2",
    name: "T-02",
    capacity: 4,
    status: "occupied",
    currentOrder: {
      orderNumber: "ORD-1001",
      guests: 3,
      startTime: new Date(Date.now() - 45 * 60000),
      amount: 125000,
    },
  },
  {
    id: "3",
    name: "T-03",
    capacity: 2,
    status: "reserved",
  },
  {
    id: "4",
    name: "T-04",
    capacity: 6,
    status: "available",
  },
  {
    id: "5",
    name: "T-05",
    capacity: 4,
    status: "occupied",
    currentOrder: {
      orderNumber: "ORD-1002",
      guests: 4,
      startTime: new Date(Date.now() - 30 * 60000),
      amount: 85000,
    },
  },
  {
    id: "6",
    name: "T-06",
    capacity: 2,
    status: "available",
  },
  {
    id: "7",
    name: "T-07",
    capacity: 8,
    status: "reserved",
  },
  {
    id: "8",
    name: "T-08",
    capacity: 4,
    status: "occupied",
    currentOrder: {
      orderNumber: "ORD-1003",
      guests: 2,
      startTime: new Date(Date.now() - 60 * 60000),
      amount: 156000,
    },
  },
  {
    id: "9",
    name: "T-09",
    capacity: 2,
    status: "available",
  },
  {
    id: "10",
    name: "T-10",
    capacity: 4,
    status: "available",
  },
];

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const formatCurrency = (paise: number) => `₹${(paise / 100).toFixed(2)}`;
  
  const getTimeSince = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "occupied":
        return "bg-red-100 text-red-800 border-red-200";
      case "reserved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-zinc-100 text-zinc-800 border-zinc-200";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-50 hover:bg-green-100 border-green-200";
      case "occupied":
        return "bg-red-50 hover:bg-red-100 border-red-200";
      case "reserved":
        return "bg-blue-50 hover:bg-blue-100 border-blue-200";
      default:
        return "bg-zinc-50 hover:bg-zinc-100 border-zinc-200";
    }
  };

  const handleAssignTable = (tableId: string) => {
    setTables(tables.map(t => 
      t.id === tableId 
        ? { 
            ...t, 
            status: "occupied" as const,
            currentOrder: {
              orderNumber: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
              guests: Math.floor(Math.random() * t.capacity) + 1,
              startTime: new Date(),
              amount: 0,
            }
          }
        : t
    ));
  };

  const handleFreeTable = (tableId: string) => {
    setTables(tables.map(t => 
      t.id === tableId 
        ? { ...t, status: "available" as const, currentOrder: undefined }
        : t
    ));
  };

  const filteredTables = filterStatus === "all" 
    ? tables 
    : tables.filter(t => t.status === filterStatus);

  const stats = {
    total: tables.length,
    available: tables.filter(t => t.status === "available").length,
    occupied: tables.filter(t => t.status === "occupied").length,
    reserved: tables.filter(t => t.status === "reserved").length,
  };

  return (
    <div className="p-4 md:p-6">
      {/* Stats */}
      <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className={filterStatus === "all" ? "ring-2 ring-zinc-900" : ""}>
          <CardContent className="p-4 cursor-pointer" onClick={() => setFilterStatus("all")}>
            <div className="text-sm text-zinc-500 mb-1">Total Tables</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className={filterStatus === "available" ? "ring-2 ring-green-500" : ""}>
          <CardContent className="p-4 cursor-pointer" onClick={() => setFilterStatus("available")}>
            <div className="text-sm text-zinc-500 mb-1">Available</div>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          </CardContent>
        </Card>
        <Card className={filterStatus === "occupied" ? "ring-2 ring-red-500" : ""}>
          <CardContent className="p-4 cursor-pointer" onClick={() => setFilterStatus("occupied")}>
            <div className="text-sm text-zinc-500 mb-1">Occupied</div>
            <div className="text-2xl font-bold text-red-600">{stats.occupied}</div>
          </CardContent>
        </Card>
        <Card className={filterStatus === "reserved" ? "ring-2 ring-blue-500" : ""}>
          <CardContent className="p-4 cursor-pointer" onClick={() => setFilterStatus("reserved")}>
            <div className="text-sm text-zinc-500 mb-1">Reserved</div>
            <div className="text-2xl font-bold text-blue-600">{stats.reserved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredTables.map((table) => (
          <Card 
            key={table.id} 
            className={`transition-all ${getStatusBgColor(table.status)}`}
          >
            <CardContent className="p-4">
              {/* Table Header */}
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold">{table.name}</h3>
                <Badge className={getStatusColor(table.status)}>
                  {table.status}
                </Badge>
              </div>

              {/* Table Info */}
              <div className="mb-3 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-zinc-600">
                  <Users className="h-4 w-4" />
                  <span>Capacity: {table.capacity}</span>
                </div>
                
                {table.currentOrder && (
                  <>
                    <div className="flex items-center gap-2 text-zinc-600">
                      <Users className="h-4 w-4" />
                      <span>Guests: {table.currentOrder.guests}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600">
                      <Clock className="h-4 w-4" />
                      <span>{getTimeSince(table.currentOrder.startTime)}</span>
                    </div>
                    {table.currentOrder.amount > 0 && (
                      <div className="flex items-center gap-2 text-zinc-600">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(table.currentOrder.amount)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action Button */}
              {table.status === "available" && (
                <Button 
                  onClick={() => handleAssignTable(table.id)} 
                  size="sm" 
                  className="w-full"
                >
                  Assign
                </Button>
              )}
              {table.status === "occupied" && (
                <Button 
                  onClick={() => handleFreeTable(table.id)} 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                >
                  Free Table
                </Button>
              )}
              {table.status === "reserved" && (
                <Button 
                  onClick={() => handleAssignTable(table.id)} 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                >
                  Confirm
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div className="py-12 text-center text-zinc-400">
          <p>No tables found</p>
        </div>
      )}
    </div>
  );
}
