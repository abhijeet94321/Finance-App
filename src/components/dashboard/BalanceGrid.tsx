
"use client";

import React from "react";
import { useFinance, AccountType } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Landmark, Wallet, CreditCard, ArrowUpRight, ArrowDownRight, Receipt } from "lucide-react";

export function BalanceGrid() {
  const { accounts } = useFinance();

  // Net wealth = Assets (Cash/Bank) - Liabilities (Loans/Credit Card Debt)
  const assets = accounts
    .filter(a => a.type === 'bank' || a.type === 'cash')
    .reduce((sum, a) => sum + a.balance, 0);

  const liabilities = accounts
    .filter(a => a.type === 'loan' || a.type === 'card')
    .reduce((sum, a) => sum + a.balance, 0);

  const netWealth = assets - liabilities;
  
  const getIcon = (type: AccountType) => {
    switch (type) {
      case 'bank': return <Landmark className="h-5 w-5" />;
      case 'card': return <CreditCard className="h-5 w-5" />;
      case 'cash': return <Wallet className="h-5 w-5" />;
      case 'loan': return <Receipt className="h-5 w-5" />;
      default: return <Wallet className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary/10 p-6 md:p-8 rounded-[2rem] border border-primary/20 backdrop-blur-xl relative overflow-hidden group transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(158,158,255,0.3)]">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 transition-transform group-hover:scale-110">
          <Wallet className="h-24 w-24 md:h-32 md:w-32 text-primary" />
        </div>
        <div className="relative">
          <h2 className="text-[10px] font-headline uppercase tracking-[0.2em] text-primary mb-2">Net Combined Wealth</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tight">
              ₹{netWealth.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-headline uppercase text-muted-foreground">Assets</p>
                <p className="text-xs md:text-sm font-headline font-semibold text-emerald-400">₹{assets.toLocaleString('en-IN')}</p>
              </div>
            </div>
            {liabilities > 0 && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <ArrowDownRight className="h-4 w-4 text-rose-400" />
                </div>
                <div>
                  <p className="text-[10px] font-headline uppercase text-muted-foreground">Liabilities</p>
                  <p className="text-xs md:text-sm font-headline font-semibold text-rose-400">₹{liabilities.toLocaleString('en-IN')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="cozy-grid">
        {accounts.slice(0, 4).map((acc) => (
          <Card key={acc.id} className="glass-card border-white/5 hover:border-primary/20 transition-all duration-300 group flex flex-col items-center justify-center aspect-square text-center p-4">
            <div className="p-3 rounded-full bg-secondary/50 text-primary mb-3 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
              {getIcon(acc.type)}
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-headline uppercase text-muted-foreground tracking-widest">{acc.type}</div>
              <div className="text-xs font-medium text-white truncate max-w-[120px]">{acc.name}</div>
              <div className={`text-sm md:text-base font-headline font-bold ${acc.type === 'loan' || acc.type === 'card' ? 'text-rose-400' : 'text-primary'}`}>
                ₹{acc.balance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
