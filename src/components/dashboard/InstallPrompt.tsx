
"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Share, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios" | "other">("other");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect platform
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);

    if (isIOS) setPlatform("ios");
    else if (isAndroid) setPlatform("android");

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone;

    if (!isStandalone) {
      // Delay prompt slightly
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Capture beforeinstallprompt for Android/Chrome
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform("android");
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[100] animate-fade-in md:hidden">
      <div className="glass-card bg-primary p-4 rounded-2xl shadow-2xl border-white/20 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="bg-white/20 p-2 rounded-xl h-10 w-10 flex items-center justify-center">
              <Download className="text-white h-5 w-5" />
            </div>
            <div>
              <p className="text-white font-headline font-bold text-sm">Install Saldo App</p>
              <p className="text-white/80 text-xs">Access your ledger faster from your home screen.</p>
            </div>
          </div>
          <button onClick={() => setShowPrompt(false)} className="text-white/50 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {platform === "android" ? (
          <Button 
            onClick={handleInstallClick}
            className="w-full bg-white text-primary hover:bg-white/90 font-headline font-bold rounded-xl"
          >
            Install Now
          </Button>
        ) : platform === "ios" ? (
          <div className="bg-white/10 rounded-xl p-3 flex flex-col gap-2">
            <p className="text-[10px] text-white/90 flex items-center gap-2">
              1. Tap the <Share className="h-3 w-3 inline" /> share button below.
            </p>
            <p className="text-[10px] text-white/90 flex items-center gap-2">
              2. Scroll down and tap <PlusSquare className="h-3 w-3 inline" /> "Add to Home Screen".
            </p>
          </div>
        ) : (
          <p className="text-[10px] text-white/70 italic text-center">Use your browser's "Add to Home Screen" option.</p>
        )}
      </div>
    </div>
  );
}
