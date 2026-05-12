"use client";

import React, { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";

export function ReminderAlert() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show a simulated reminder on load for the "thrice daily" requirement demonstration
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md animate-fade-in px-4">
      <div className="bg-accent p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/20">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bell className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <p className="text-white font-headline font-bold text-sm">Time for a Penny-Check!</p>
            <p className="text-white/80 text-xs">Don't forget to log your recent spends or receives.</p>
          </div>
        </div>
        <button onClick={() => setVisible(false)} className="text-white/50 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
