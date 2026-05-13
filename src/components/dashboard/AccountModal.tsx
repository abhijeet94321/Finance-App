
"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinance, AccountType } from "@/lib/store";
import { Landmark, Wallet, CreditCard, Receipt } from "lucide-react";

export function AccountModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { addAccount } = useFinance();
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("bank");
  const [balance, setBalance] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !balance) return;

    addAccount({
      name,
      type,
      balance: parseFloat(balance) || 0,
    });

    setName("");
    setBalance("");
    setType("bank");
    onOpenChange(false);
  };

  const types = [
    { id: 'bank' as AccountType, label: 'Bank', icon: Landmark },
    { id: 'card' as AccountType, label: 'Credit Card', icon: CreditCard },
    { id: 'cash' as AccountType, label: 'Cash', icon: Wallet },
    { id: 'loan' as AccountType, label: 'Loan/EMI', icon: Receipt },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-primary/20 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">New Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-headline uppercase text-muted-foreground">Account Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {types.map((t) => (
                <Button
                  key={t.id}
                  type="button"
                  variant={type === t.id ? "default" : "outline"}
                  className="h-14 flex flex-col items-center justify-center gap-1 font-headline text-[10px] uppercase"
                  onClick={() => setType(t.id)}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-headline uppercase text-muted-foreground">Account Name</Label>
            <Input 
              placeholder="e.g. ICICI Savings, HDFC Credit Card..." 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background/50 h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-headline uppercase text-muted-foreground">
              {type === 'loan' || type === 'card' ? 'Current Debt Amount' : 'Starting Balance'}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-headline">₹</span>
              <Input
                type="number"
                placeholder="0.00"
                className="pl-8 font-headline bg-background/50 h-12"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                required
              />
            </div>
            {type === 'loan' && (
              <p className="text-[10px] text-accent">Loans are tracked as liabilities. Payments will reduce this balance.</p>
            )}
          </div>

          <Button type="submit" className="w-full bg-primary text-primary-foreground font-headline h-12 text-lg shadow-lg shadow-primary/20">
            Create Account
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
