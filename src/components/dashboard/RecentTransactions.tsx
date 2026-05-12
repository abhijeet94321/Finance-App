
"use client";

import React from "react";
import { useFinance } from "@/lib/store";
import { Globe, Banknote, ShoppingBag, Utensils, Home, Car, DollarSign, Package, TrendingUp, User, Landmark, HelpCircle } from "lucide-react";
import { format } from "date-fns";

export function RecentTransactions() {
  const { transactions } = useFinance();

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food': return <Utensils className="h-4 w-4" />;
      case 'housing': return <Home className="h-4 w-4" />;
      case 'transport': return <Car className="h-4 w-4" />;
      case 'shopping': return <ShoppingBag className="h-4 w-4" />;
      case 'bills': return <DollarSign className="h-4 w-4" />;
      case 'salary': return <TrendingUp className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getLedgerIcon = (type: string) => {
    switch (type) {
      case 'personal': return <User className="h-3 w-3" />;
      case 'aashram': return <Landmark className="h-3 w-3" />;
      case 'others': return <HelpCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-headline text-lg text-primary">Recent Transactions</h3>
        <button className="text-xs text-muted-foreground hover:text-primary transition-colors font-headline uppercase tracking-wider">View All</button>
      </div>
      
      <div className="space-y-2">
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-12 bg-secondary/10 rounded-2xl border border-dashed border-white/5">
            <p className="text-sm text-muted-foreground">No transactions recorded yet.</p>
          </div>
        ) : (
          sortedTransactions.slice(0, 10).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-white/5 hover:border-white/10 transition-all animate-fade-in group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {getCategoryIcon(tx.category)}
                </div>
                <div>
                  <div className="font-medium text-sm text-white flex items-center gap-2">
                    {tx.description}
                    {tx.method === 'online' ? (
                      <div className="flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-1.5 rounded">
                        <Globe className="h-3 w-3" />
                        {tx.appName || "Online"}
                      </div>
                    ) : (
                      <Banknote className="h-3 w-3 text-muted-foreground opacity-50" />
                    )}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase font-headline tracking-wider flex items-center gap-2">
                    {format(new Date(tx.date), 'MMM dd')} • {tx.category} • 
                    <span className="flex items-center gap-1">
                      {getLedgerIcon(tx.ledgerType)}
                      {tx.ledgerType === 'others' ? tx.recipient : tx.ledgerType}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`font-headline font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
