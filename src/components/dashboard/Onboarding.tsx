"use client";

import React, { useState } from "react";
import { useFinance, Account } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Wallet, CreditCard, Landmark } from "lucide-react";

export function Onboarding() {
  const { onboard } = useFinance();
  const [accounts, setAccounts] = useState<Partial<Account>[]>([
    { id: '1', name: "Physical Cash", type: "cash", balance: 0 },
    { id: '2', name: "Main Bank Account", type: "bank", balance: 0 },
  ]);

  const addAccount = () => {
    setAccounts([...accounts, { id: Math.random().toString(), name: "", type: "bank", balance: 0 }]);
  };

  const removeAccount = (id: string) => {
    setAccounts(accounts.filter(a => a.id !== id));
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts(accounts.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const handleFinish = () => {
    const validAccounts = accounts.filter(a => a.name && a.name.trim() !== "").map(a => ({
      ...a,
      balance: Number(a.balance) || 0,
      lastUpdated: new Date().toISOString(),
    })) as Account[];
    
    if (validAccounts.length > 0) {
      onboard(validAccounts);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
      <Card className="max-w-xl w-full glass-card border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline font-bold text-primary">Welcome to Saldo</CardTitle>
          <CardDescription className="text-lg">Let's set up your starting wealth to track every penny.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {accounts.map((acc) => (
              <div key={acc.id} className="flex gap-4 items-end bg-secondary/30 p-4 rounded-xl border border-white/5">
                <div className="flex-1 space-y-2">
                  <Label className="font-headline uppercase text-[10px] tracking-wider text-muted-foreground">Account Name</Label>
                  <Input 
                    value={acc.name || ""} 
                    onChange={(e) => updateAccount(acc.id!, { name: e.target.value })}
                    placeholder="e.g. Chase Bank, Wallet..."
                    className="bg-background/50"
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label className="font-headline uppercase text-[10px] tracking-wider text-muted-foreground">Type</Label>
                  <select 
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background/50 text-sm"
                    value={acc.type}
                    onChange={(e) => updateAccount(acc.id!, { type: e.target.value as any })}
                  >
                    <option value="bank">Bank</option>
                    <option value="card">Credit Card</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
                <div className="w-32 space-y-2">
                  <Label className="font-headline uppercase text-[10px] tracking-wider text-muted-foreground">Balance</Label>
                  <Input 
                    type="number"
                    value={acc.balance === undefined || isNaN(acc.balance) ? "" : acc.balance} 
                    onChange={(e) => {
                      const val = e.target.value === "" ? NaN : parseFloat(e.target.value);
                      updateAccount(acc.id!, { balance: val });
                    }}
                    className="bg-background/50 font-headline"
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => removeAccount(acc.id!)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={addAccount} className="w-full border-dashed border-primary/30 py-6">
            <Plus className="w-4 h-4 mr-2" /> Add Another Account
          </Button>

          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-headline font-semibold h-12 text-lg" onClick={handleFinish}>
            Set My Baseline Wealth
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
