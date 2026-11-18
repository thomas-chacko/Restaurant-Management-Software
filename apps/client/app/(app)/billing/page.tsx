"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Printer, Download, CreditCard, DollarSign } from "lucide-react";

interface Bill {
  id: string;
  orderNumber: string;
  tableName: string;
  items: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: "pending" | "paid" | "partial";
  paymentMethod?: string;
  createdAt: Date;
}

const mockBills: Bill[] = [
  {
    id: "1",
    orderNumber: "ORD-1001",
    tableName: "T-05",
    items: 4,
    subtotal: 125000,
    tax: 22500,
    discount: 0,
    total: 147500,
    status: "pending",
    createdAt: new Date(Date.now() - 15 * 60000),
  },
  {
    id: "2",
    orderNumber: "ORD-1002",
    tableName: "T-12",
    items: 2,
    subtotal: 85000,
    tax: 15300,
    discount: 10000,
    total: 90300,
    status: "paid",
    paymentMethod: "Card",
    createdAt: new Date(Date.now() - 30 * 60000),
  },
  {
    id: "3",
    orderNumber: "ORD-1003",
    tableName: "T-08",
    items: 5,
    subtotal: 156000,
    tax: 28080,
    discount: 15000,
    total: 169080,
    status: "paid",
    paymentMethod: "Cash",
    createdAt: new Date(Date.now() - 45 * 60000),
  },
];

export default function BillingPage() {
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [searchQuery, setSearchQuery] = useState("");

  const formatCurrency = (paise: number) => `₹${(paise / 100).toFixed(2)}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "partial":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-zinc-100 text-zinc-800 border-zinc-200";
    }
  };

  const handlePayment = (billId: string, method: "cash" | "card" | "upi") => {
    setBills(bills.map(bill => 
      bill.id === billId 
        ? { ...bill, status: "paid" as const, paymentMethod: method.toUpperCase() }
        : bill
    ));
  };

  const filteredBills = bills.filter(bill => 
    bill.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill.tableName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingBills = bills.filter(b => b.status === "pending");
  const totalPending = pendingBills.reduce((sum, b) => sum + b.total, 0);

  return (
    <div className="p-4 md:p-6">
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Pending Bills
            </CardTitle>
            <DollarSign className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBills.length}</div>
            <p className="text-xs text-zinc-500 mt-1">
              Total: {formatCurrency(totalPending)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Today's Collection
            </CardTitle>
            <CreditCard className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(bills.filter(b => b.status === "paid").reduce((sum, b) => sum + b.total, 0))}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {bills.filter(b => b.status === "paid").length} bills paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Avg. Bill Value
            </CardTitle>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(bills.length > 0 ? bills.reduce((sum, b) => sum + b.total, 0) / bills.length : 0)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Across {bills.length} bills</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by order number or table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 py-2 pl-10 pr-4 text-sm transition-colors hover:border-zinc-300 focus:border-zinc-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Bills List */}
      <div className="space-y-4">
        {filteredBills.map((bill) => (
          <Card key={bill.id}>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Bill Info */}
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{bill.orderNumber}</h3>
                    <Badge className={getStatusColor(bill.status)}>
                      {bill.status}
                    </Badge>
                    {bill.paymentMethod && (
                      <Badge variant="outline" className="text-xs">
                        {bill.paymentMethod}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 mb-2">
                    Table: {bill.tableName} • {bill.items} items
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-zinc-600">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(bill.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>Tax (18%):</span>
                      <span>{formatCurrency(bill.tax)}</span>
                    </div>
                    {bill.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-{formatCurrency(bill.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-zinc-200 pt-1 font-bold">
                      <span>Total:</span>
                      <span className="text-lg">{formatCurrency(bill.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 md:w-48">
                  {bill.status === "pending" ? (
                    <>
                      <Button onClick={() => handlePayment(bill.id, "cash")} className="w-full">
                        Pay Cash
                      </Button>
                      <Button onClick={() => handlePayment(bill.id, "card")} variant="outline" className="w-full">
                        Pay Card
                      </Button>
                      <Button onClick={() => handlePayment(bill.id, "upi")} variant="outline" className="w-full">
                        Pay UPI
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full gap-2">
                        <Printer className="h-4 w-4" />
                        Print Bill
                      </Button>
                      <Button variant="outline" className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBills.length === 0 && (
        <div className="py-12 text-center text-zinc-400">
          <p>No bills found</p>
        </div>
      )}
    </div>
  );
}
