"use client";

import React from "react";
import { useFinance } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, Wallet, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function BalanceGrid() {
  const { accounts, transactions } = useFinance();

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'bank': return <Landmark className="h-4 w-4" />;
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'cash': return <Wallet className="h-4 w-4" />;
      default: return <Wallet className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary/10 p-8 rounded-[2rem] border border-primary/20 backdrop-blur-xl relative overflow-hidden group transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(158,158,255,0.3)]">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 transition-transform group-hover:scale-110">
          <Wallet className="h-32 w-32 text-primary" />
        </div>
        <div className="relative">
          <h2 className="text-[10px] font-headline uppercase tracking-[0.2em] text-primary mb-2">Total Combined Wealth</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl md:text-6xl font-headline font-bold text-white tracking-tight">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-6 flex gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-headline uppercase text-muted-foreground">Monthly In</p>
                <p className="font-headline font-semibold text-emerald-400">+$2,450.00</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                <ArrowDownRight className="h-4 w-4 text-rose-400" />
              </div>
              <div>
                <p className="text-[10px] font-headline uppercase text-muted-foreground">Monthly Out</p>
                <p className="font-headline font-semibold text-rose-400">-$1,280.45</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cozy-grid">
        {accounts.map((acc) => (
          <Card key={acc.id} className="glass-card border-white/5 hover:border-primary/20 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="p-2 rounded-lg bg-secondary/50 text-primary group-hover:scale-110 transition-transform">
                {getIcon(acc.type)}
              </div>
              <span className="text-[10px] font-headline uppercase text-muted-foreground tracking-widest">{acc.type}</span>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium text-muted-foreground mb-1">{acc.name}</div>
              <div className="text-2xl font-headline font-semibold text-white">
                ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
