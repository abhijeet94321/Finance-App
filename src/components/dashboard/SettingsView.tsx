
"use client";

import React, { useState } from "react";
import { useFinance } from "@/lib/store";
import { AlertTriangle, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export function SettingsView() {
  const { resetData } = useFinance();
  const { toast } = useToast();
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    try {
      await resetData();
      toast({
        title: "Data Reset Complete",
        description: "All accounts and transactions have been wiped. Starting fresh.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: "Could not wipe your data. Please try again.",
      });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-2xl pb-24 md:pb-0">
      <header>
        <p className="font-headline text-primary uppercase tracking-widest text-xs mb-1">Preferences & Privacy</p>
        <h2 className="text-3xl font-headline font-bold text-white">Security & Settings</h2>
      </header>

      <div className="glass-card rounded-[2rem] p-8 border-destructive/20 bg-destructive/5">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-destructive/10 p-3 rounded-2xl">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h3 className="font-headline text-xl text-white mb-2">Reset All Data</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This action will permanently delete all your accounts, starting balances, and historical transactions. 
            </p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full md:w-fit font-headline font-bold h-12 px-8 rounded-xl shadow-lg shadow-destructive/20">
              <Trash2 className="h-4 w-4 mr-2" /> Reset Everything
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass-card border-destructive/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-headline text-white text-xl">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This action cannot be undone. All records will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-secondary/50 border-white/10 hover:bg-secondary">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleReset}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {resetting ? "Wiping..." : "Yes, Reset My Data"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="glass-card rounded-[2rem] p-8 border-white/5 space-y-6">
        <h3 className="font-headline text-xl text-white">Application Info</h3>
        <div className="grid gap-4">
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <span className="text-sm text-muted-foreground">Version</span>
            <span className="text-sm font-headline text-white">1.0.0-mobile</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-sm text-muted-foreground">Privacy</span>
            <span className="text-sm font-headline text-primary flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Encrypted Local State
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
