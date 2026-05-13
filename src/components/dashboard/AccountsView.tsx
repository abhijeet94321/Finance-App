
"use client";

import React, { useState } from "react";
import { useFinance, AccountType } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Landmark, Wallet, CreditCard, Receipt, Plus, Trash2, AlertCircle } from "lucide-react";
import { AccountModal } from "./AccountModal";
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

export function AccountsView() {
  const { accounts, deleteAccount } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getIcon = (type: AccountType) => {
    switch (type) {
      case 'bank': return <Landmark className="h-5 w-5" />;
      case 'card': return <CreditCard className="h-5 w-5" />;
      case 'cash': return <Wallet className="h-5 w-5" />;
      case 'loan': return <Receipt className="h-5 w-5" />;
      default: return <Wallet className="h-5 w-5" />;
    }
  };

  const getBalanceColor = (acc: any) => {
    if (acc.type === 'loan' || acc.type === 'card') {
      return acc.balance > 0 ? "text-rose-400" : "text-emerald-400";
    }
    return acc.balance >= 0 ? "text-primary" : "text-rose-400";
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24 md:pb-0">
      <header className="flex items-center justify-between">
        <div>
          <p className="font-headline text-primary uppercase tracking-widest text-xs mb-1">Asset Management</p>
          <h2 className="text-3xl font-headline font-bold text-white">Accounts & Loans</h2>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <Card key={acc.id} className="glass-card border-white/5 group hover:border-primary/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-secondary/50 text-primary">
                  {getIcon(acc.type)}
                </div>
                <div>
                  <CardTitle className="text-sm font-headline font-semibold text-white truncate max-w-[150px]">
                    {acc.name}
                  </CardTitle>
                  <p className="text-[10px] uppercase text-muted-foreground tracking-widest">
                    {acc.type}
                  </p>
                </div>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-card border-destructive/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-headline text-white">Delete Account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove {acc.name} from your dashboard. Transaction history will remain but the balance will no longer contribute to your total wealth.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-secondary/50 border-white/5">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteAccount(acc.id)} className="bg-destructive text-white hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-headline font-bold ${getBalanceColor(acc)}`}>
                ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[9px] text-muted-foreground mt-1">
                Last updated: {new Date(acc.lastUpdated).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}

        {accounts.length === 0 && (
          <div className="col-span-full py-12 text-center bg-secondary/10 rounded-[2rem] border border-dashed border-white/10">
            <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground">No accounts found. Add your first bank, card, or loan.</p>
          </div>
        )}
      </div>

      <AccountModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
