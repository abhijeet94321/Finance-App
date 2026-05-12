
"use client";

import React, { useState } from "react";
import { useFinance, Transaction } from "@/lib/store";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export function TransactionsView() {
  const { transactions } = useFinance();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [ledgerFilter, setLedgerFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc'
  });

  const handleSort = (key: keyof Transaction) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
                         t.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    const matchesLedger = ledgerFilter === "all" || t.ledgerType === ledgerFilter;
    
    return matchesSearch && matchesType && matchesLedger;
  }).sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === undefined || bValue === undefined) return 0;

    if (sortConfig.key === 'date') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return sortConfig.direction === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  return (
    <div className="space-y-8 animate-fade-in pb-24 md:pb-0">
      <header>
        <p className="font-headline text-primary uppercase tracking-widest text-xs mb-1">Ledger Management</p>
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-white">Transactions</h2>
      </header>

      <div className="flex flex-col gap-4 bg-secondary/20 p-4 rounded-2xl border border-white/5">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search transactions..." 
            className="pl-10 bg-background/50 border-white/10 h-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-background/50 border-white/10 h-10 flex-1">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ledgerFilter} onValueChange={setLedgerFilter}>
            <SelectTrigger className="bg-background/50 border-white/10 h-10 flex-1">
              <SelectValue placeholder="Ledger" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ledgers</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="aashram">Aashram</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="p-4 text-[10px] font-headline uppercase tracking-widest text-muted-foreground cursor-pointer" onClick={() => handleSort('date')}>Date</th>
                <th className="p-4 text-[10px] font-headline uppercase tracking-widest text-muted-foreground">Description</th>
                <th className="p-4 text-[10px] font-headline uppercase tracking-widest text-muted-foreground text-right cursor-pointer" onClick={() => handleSort('amount')}>Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-xs text-white">{format(new Date(tx.date), 'MMM dd')}</td>
                  <td className="p-4">
                    <div className="font-medium text-xs text-white truncate max-w-[150px]">{tx.description}</div>
                    <div className="text-[9px] text-muted-foreground uppercase">{tx.category}</div>
                  </td>
                  <td className="p-4 text-right">
                    <span className={`font-headline font-bold text-xs ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-sm text-muted-foreground">No matching transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
