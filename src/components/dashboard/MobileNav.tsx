
"use client";

import React from "react";
import { LayoutDashboard, ReceiptText, BarChart3, Settings, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

type View = "dashboard" | "transactions" | "accounts" | "reports" | "settings";

interface MobileNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function MobileNav({ currentView, onViewChange }: MobileNavProps) {
  const items = [
    { id: "dashboard" as View, icon: LayoutDashboard, label: "Home" },
    { id: "accounts" as View, icon: Wallet, label: "Vault" },
    { id: "transactions" as View, icon: ReceiptText, label: "Ledger" },
    { id: "reports" as View, icon: BarChart3, label: "Reports" },
    { id: "settings" as View, icon: Settings, label: "Security" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-white/5 md:hidden px-6 py-3 pb-8">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-white"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-headline uppercase tracking-wider font-bold">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
