"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
  isVeg: boolean;
}

const mockMenuItems: MenuItem[] = [
  { id: "1", name: "Butter Chicken", category: "Main Course", price: 35000, description: "Creamy tomato-based curry", available: true, isVeg: false },
  { id: "2", name: "Paneer Tikka Masala", category: "Main Course", price: 28000, description: "Grilled paneer in spicy gravy", available: true, isVeg: true },
  { id: "3", name: "Garlic Naan", category: "Breads", price: 5000, description: "Fresh naan with garlic", available: true, isVeg: true },
  { id: "4", name: "Biryani", category: "Rice", price: 32000, description: "Aromatic basmati rice with spices", available: true, isVeg: false },
  { id: "5", name: "Gulab Jamun", category: "Desserts", price: 8000, description: "Sweet milk dumplings", available: true, isVeg: true },
  { id: "6", name: "Mango Lassi", category: "Beverages", price: 8000, description: "Refreshing yogurt drink", available: false, isVeg: true },
];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>(mockMenuItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const formatCurrency = (paise: number) => `₹${(paise / 100).toFixed(2)}`;
  
  const categories = ["all", ...Array.from(new Set(items.map(i => i.category)))];
  
  const filteredItems = items.filter(item => 
    (filterCategory === "all" || item.category === filterCategory) &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleAvailability = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, available: !i.available } : i));
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">Menu Items ({filteredItems.length})</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 py-2 pl-10 pr-4 text-sm transition-colors hover:border-zinc-300 focus:border-zinc-400 focus:outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <Button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              variant={filterCategory === cat ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap"
            >
              {cat === "all" ? "All" : cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className={!item.available ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <Badge variant="outline" className={item.isVeg ? "border-green-500 text-green-700" : "border-red-500 text-red-700"}>
                      {item.isVeg ? "🟢" : "🔴"}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 mb-2">{item.category}</p>
                  <p className="text-sm text-zinc-600 mb-3">{item.description}</p>
                  <p className="text-lg font-bold">{formatCurrency(item.price)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => toggleAvailability(item.id)}
                  variant={item.available ? "outline" : "default"}
                  size="sm"
                  className="flex-1"
                >
                  {item.available ? "Available" : "Mark Available"}
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-12 text-center text-zinc-400">
          <p>No menu items found</p>
        </div>
      )}
    </div>
  );
}
