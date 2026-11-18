"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AIChat } from "@/components/ai/AIChat";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; description?: string }> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Welcome back, here's what's happening today",
  },
  "/orders": {
    title: "Orders",
    description: "Manage and track all orders",
  },
  "/billing": {
    title: "Billing",
    description: "Process payments and close bills",
  },
  "/delivery": {
    title: "Delivery",
    description: "Manage deliveries and riders",
  },
  "/tables": {
    title: "Tables",
    description: "Manage restaurant tables",
  },
  "/menu": {
    title: "Menu",
    description: "Manage menu items and categories",
  },
  "/inventory": {
    title: "Inventory",
    description: "Track stock and inventory",
  },
  "/customers": {
    title: "Customers",
    description: "Manage customer database",
  },
  "/staff": {
    title: "Staff",
    description: "Manage staff and roles",
  },
  "/reports": {
    title: "Reports",
    description: "View sales and performance reports",
  },
  "/settings": {
    title: "Settings",
    description: "Configure system settings",
  },
  "/kitchen": {
    title: "Kitchen Queue",
    description: "Manage kitchen orders",
  },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const pageInfo = pageTitles[pathname] || { title: "Restaurant Management" };

  // TODO: Get actual user role from authentication
  const userRole = "manager"; // Hardcoded for now

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <Sidebar 
        role={userRole as any}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          title={pageInfo.title}
          description={pageInfo.description}
          onMenuClick={() => setSidebarOpen(true)}
          notificationCount={3}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <AIChat />
    </div>
  );
}
