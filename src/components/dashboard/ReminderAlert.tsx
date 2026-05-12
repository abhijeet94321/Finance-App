"use client";

import React, { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";

export function ReminderAlert() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show a simulated reminder on load for the "thrice daily" requirement demonstration
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-[150] animate-fade-in md:top-6 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md">
      <div className="glass-card bg-accent/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/20">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bell className="h-4 w-4 text-white animate-pulse" />
          </div>
          <div>
            <p className="text-white font-headline font-bold text-xs">Penny-Check Reminder</p>
            <p className="text-white/80 text-[10px]">Log your recent spends now to stay accurate!</p>
          </div>
        </div>
        <button onClick={() => setVisible(false)} className="text-white/50 hover:text-white p-1">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
