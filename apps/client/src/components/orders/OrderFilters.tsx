"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
}

export function OrderFilters({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange,
}: OrderFiltersProps) {
  return (
    <div className="space-y-4 border-b border-zinc-200 bg-white p-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 py-2 pl-10 pr-4 text-sm transition-colors hover:border-zinc-300 focus:border-zinc-400 focus:outline-none"
        />
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedStatus === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange("all")}
          className="whitespace-nowrap"
        >
          All
        </Button>
        <Button
          variant={selectedStatus === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange("pending")}
          className="whitespace-nowrap"
        >
          Pending
        </Button>
        <Button
          variant={selectedStatus === "cooking" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange("cooking")}
          className="whitespace-nowrap"
        >
          Cooking
        </Button>
        <Button
          variant={selectedStatus === "ready" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange("ready")}
          className="whitespace-nowrap"
        >
          Ready
        </Button>
      </div>

      {/* Type Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedType === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onTypeChange("all")}
          className="whitespace-nowrap"
        >
          All Types
        </Button>
        <Button
          variant={selectedType === "dine-in" ? "default" : "outline"}
          size="sm"
          onClick={() => onTypeChange("dine-in")}
          className="whitespace-nowrap"
        >
          🍽️ Dine-in
        </Button>
        <Button
          variant={selectedType === "delivery" ? "default" : "outline"}
          size="sm"
          onClick={() => onTypeChange("delivery")}
          className="whitespace-nowrap"
        >
          🚚 Delivery
        </Button>
      </div>
    </div>
  );
}
