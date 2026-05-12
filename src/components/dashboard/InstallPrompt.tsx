
"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Share, PlusSquare, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios" | "other">("other");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;
    
    if (isStandalone) return;

    // Detect platform
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);

    if (isIOS) setPlatform("ios");
    else if (isAndroid) setPlatform("android");

    // Handle dismissal check (show again after 24 hours if dismissed)
    const lastDismissed = localStorage.getItem("install-prompt-dismissed");
    if (lastDismissed) {
      const oneDay = 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(lastDismissed) < oneDay) {
        return;
      }
    }

    // Capture the beforeinstallprompt event for Android/Chrome
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
      console.log('Capture beforeinstallprompt event');
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show fallback prompt for iOS or if browser doesn't support the event but is mobile
    const timer = setTimeout(() => {
      if (isIOS) {
        setShowPrompt(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem("install-prompt-dismissed", Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[200] animate-fade-in md:hidden">
      <div className="glass-card bg-card/95 backdrop-blur-2xl p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-primary/20 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2.5 rounded-xl">
              <Smartphone className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-white font-headline font-bold text-sm">Install Saldo</p>
              <p className="text-muted-foreground text-[10px]">Access your ledger instantly from your home screen.</p>
            </div>
          </div>
          <button onClick={dismissPrompt} className="text-muted-foreground hover:text-white p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        {platform === "android" && deferredPrompt ? (
          <Button 
            onClick={handleInstallClick}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-headline font-bold rounded-xl h-10 text-xs shadow-lg shadow-primary/20"
          >
            <Download className="h-4 w-4 mr-2" /> Install Now
          </Button>
        ) : platform === "ios" ? (
          <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
            <p className="text-[11px] text-white/90 flex items-center flex-wrap gap-1.5 leading-relaxed justify-center text-center">
              Tap <Share className="h-3.5 w-3.5 text-primary" /> then scroll down and tap <PlusSquare className="h-3.5 w-3.5 text-primary" /> <span className="font-bold text-primary">"Add to Home Screen"</span>
            </p>
          </div>
        ) : (
          <div className="bg-secondary/20 rounded-xl p-3 border border-white/5">
            <p className="text-[10px] text-muted-foreground text-center">
              To install, open your browser menu and select <span className="text-white font-bold">"Install App"</span> or <span className="text-white font-bold">"Add to Home Screen"</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
