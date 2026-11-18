"use client";

import { Bell, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  description?: string;
  onMenuClick: () => void;
  notificationCount?: number;
}

export function Header({ title, description, onMenuClick, notificationCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left: Menu button + Title */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={onMenuClick}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-zinc-900 text-white transition-colors hover:bg-zinc-800 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div>
            <h1 className="text-lg md:text-xl font-bold text-zinc-900">{title}</h1>
            {description && (
              <p className="hidden sm:block text-xs md:text-sm text-zinc-500">{description}</p>
            )}
          </div>
        </div>

        {/* Right: Notifications + User */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notification Bell */}
          <button className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>

          {/* User Avatar (mobile) */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
            JM
          </div>
        </div>
      </div>
    </header>
  );
}
