"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: "admin" | "manager" | "kitchen" | "delivery";
  isOpen: boolean;
  onClose: () => void;
}

const managerLinks = [
  { href: "/manager/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/manager/orders", label: "Orders", icon: ShoppingBag },
  { href: "/kitchen", label: "Kitchen Queue", icon: ChefHat },
  { href: "/manager/billing", label: "Billing", icon: CreditCard },
  { href: "/manager/delivery", label: "Delivery", icon: Truck },
  { href: "/manager/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/manager/reports", label: "Reports", icon: FileText },
];

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/reports", label: "Reports", icon: FileText },
];

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const links = role === "admin" ? adminLinks : managerLinks;

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
      <nav className="flex-1 space-y-1 p-4">
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
          onClick={() => onClose()}
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
