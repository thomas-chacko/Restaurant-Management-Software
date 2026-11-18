"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="text-[120px] font-bold text-zinc-200 md:text-[180px]">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl">🍽️</div>
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="mb-3 text-2xl font-bold text-zinc-900 md:text-3xl">
          Page Not Found
        </h1>
        <p className="mb-8 text-zinc-500 md:text-lg">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Link href="/manager/dashboard">
            <Button className="w-full gap-2 sm:w-auto">
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12 text-sm text-zinc-400">
          <p>Need help? Contact your system administrator.</p>
        </div>
      </div>
    </div>
  );
}
