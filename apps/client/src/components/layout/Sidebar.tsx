"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Truck,
  UtensilsCrossed,
  Users,
  FileText,
  LogOut,
  X,
  ChefHat,
  Package,
  Grid3x3,
  UserCircle,
  Settings,
  Receipt,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: "admin" | "manager" | "kitchen" | "delivery";
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  href: string;
  label: string;
  icon: any;
  roles: ("admin" | "manager" | "kitchen" | "delivery")[]; // Which roles can see this menu
}

// Single unified menu - filter by role when rendering
const allMenuItems: MenuItem[] = [
  { 
    href: "/dashboard", 
    label: "Dashboard", 
    icon: LayoutDashboard,
    roles: ["admin", "manager", "kitchen", "delivery"]
  },
  { 
    href: "/orders", 
    label: "Orders", 
    icon: ShoppingBag,
    roles: ["admin", "manager"]
  },
  { 
    href: "/kitchen", 
    label: "Kitchen Queue", 
    icon: ChefHat,
    roles: ["admin", "manager", "kitchen"]
  },
  { 
    href: "/billing", 
    label: "Billing", 
    icon: CreditCard,
    roles: ["admin", "manager"]
  },
  { 
    href: "/delivery", 
    label: "Delivery", 
    icon: Truck,
    roles: ["admin", "manager", "delivery"]
  },
  { 
    href: "/tables", 
    label: "Tables", 
    icon: Grid3x3,
    roles: ["admin", "manager"]
  },
  { 
    href: "/menu", 
    label: "Menu", 
    icon: UtensilsCrossed,
    roles: ["admin", "manager"]
  },
  { 
    href: "/inventory", 
    label: "Inventory", 
    icon: Package,
    roles: ["admin", "manager"]
  },
  { 
    href: "/customers", 
    label: "Customers", 
    icon: UserCircle,
    roles: ["admin", "manager"]
  },
  { 
    href: "/staff", 
    label: "Staff", 
    icon: Users,
    roles: ["admin", "manager"]
  },
  { 
    href: "/categories", 
    label: "Categories", 
    icon: Grid3x3,
    roles: ["admin"]
  },
  { 
    href: "/tax-billing", 
    label: "Tax & Billing", 
    icon: Receipt,
    roles: ["admin"]
  },
  { 
    href: "/users", 
    label: "Users & Roles", 
    icon: Shield,
    roles: ["admin"]
  },
  { 
    href: "/audit-logs", 
    label: "Audit Logs", 
    icon: FileText,
    roles: ["admin"]
  },
  { 
    href: "/reports", 
    label: "Reports", 
    icon: FileText,
    roles: ["admin", "manager"]
  },
  { 
    href: "/settings", 
    label: "Settings", 
    icon: Settings,
    roles: ["admin", "manager"]
  },
];

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Filter menu items based on user role
  const links = allMenuItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    // TODO: Clear authentication session
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-zinc-200 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-xl text-white">
            🍽️
          </div>
          <div>
            <h1 className="text-lg font-bold">Restaurant</h1>
            <p className="text-xs text-zinc-500 capitalize">{role} Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => onClose()}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-zinc-200 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
    </>
  );
}
