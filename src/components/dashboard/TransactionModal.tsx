"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinance, PaymentMethod, TransactionType } from "@/lib/store";
import { Plus, CreditCard, Banknote, Globe, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export function TransactionModal() {
  const { accounts, addTransaction } = useFinance();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionType>("expense");
  const [method, setMethod] = useState<PaymentMethod>("online");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !accountId) return;

    addTransaction({
      date: new Date().toISOString(),
      description,
      amount: parseFloat(amount),
      type,
      category,
      method,
      accountId,
    });

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setCategory("General");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-2xl bg-accent hover:bg-accent/90 animate-bounce">
          <Plus className="h-8 w-8 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-primary/20 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">Log Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === "expense" ? "default" : "outline"}
              className="flex-1 font-headline"
              onClick={() => setType("expense")}
            >
              Expense
            </Button>
            <Button
              type="button"
              variant={type === "income" ? "default" : "outline"}
              className="flex-1 font-headline"
              onClick={() => setType("income")}
            >
              Income
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-headline uppercase text-muted-foreground">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-headline">$</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-8 text-2xl font-headline bg-background/50 h-14"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-headline uppercase text-muted-foreground">Account</Label>
              <select
                className="w-full h-10 px-3 rounded-md bg-background/50 border border-input text-sm"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-headline uppercase text-muted-foreground">Method</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={method === "online" ? "secondary" : "ghost"}
                  className="flex-1"
                  onClick={() => setMethod("online")}
                >
                  <Globe className="h-4 w-4 mr-1" /> Online
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={method === "cash" ? "secondary" : "ghost"}
                  className="flex-1"
                  onClick={() => setMethod("cash")}
                >
                  <Banknote className="h-4 w-4 mr-1" /> Cash
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-headline uppercase text-muted-foreground">Description</Label>
            <Input
              placeholder="What was this for?"
              className="bg-background/50"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-headline uppercase text-muted-foreground">Category</Label>
            <select
              className="w-full h-10 px-3 rounded-md bg-background/50 border border-input text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {["Food", "Housing", "Transport", "Shopping", "Bills", "Salary", "Gift", "General"].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white font-headline h-12 text-lg">
            Record Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
