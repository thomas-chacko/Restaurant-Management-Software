"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AIChat } from "@/components/ai/AIChat";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; description?: string }> = {
  "/manager/dashboard": {
    title: "Dashboard",
    description: "Welcome back, here's what's happening today",
  },
  "/manager/orders": {
    title: "Orders",
    description: "Manage and track all orders",
  },
  "/manager/billing": {
    title: "Billing",
    description: "Process payments and close bills",
  },
  "/manager/delivery": {
    title: "Delivery",
    description: "Manage deliveries and riders",
  },
  "/manager/menu": {
    title: "Menu",
    description: "Manage menu items and categories",
  },
  "/manager/reports": {
    title: "Reports",
    description: "View sales and performance reports",
  },
};

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const pageInfo = pageTitles[pathname] || { title: "Manager Portal" };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <Sidebar 
        role="manager" 
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
