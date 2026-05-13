
"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinance, PaymentMethod, TransactionType, LedgerType } from "@/lib/store";
import { Plus, User, Landmark, HelpCircle, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PAYMENT_APPS = [
  "Google Pay",
  "PhonePe",
  "Kiwi",
  "Cred",
  "WhatsApp",
  "Amazon Pay",
  "Net Banking",
  "Other"
];

const CATEGORIES = {
  expense: ["Food", "Housing", "Transport", "Shopping", "Bills", "Loan Repayment", "EMI", "Gift", "General"],
  income: ["Salary", "Freelance", "Investment", "Loan Disbursement", "Refund", "Gift", "General"]
};

export function TransactionModal() {
  const { accounts, addTransaction } = useFinance();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionType>("expense");
  const [method, setMethod] = useState<PaymentMethod>("online");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [appName, setAppName] = useState("");
  const [ledgerType, setLedgerType] = useState<LedgerType>("personal");
  const [recipient, setRecipient] = useState("");

  useEffect(() => {
    const account = accounts.find(a => a.id === accountId);
    if (account) {
      if (account.type === 'cash') {
        setMethod('cash');
      } else {
        setMethod('online');
      }
    }
  }, [accountId, accounts]);

  // Set default category when type changes
  useEffect(() => {
    setCategory(CATEGORIES[type][0]);
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || !description || !accountId) return;

    const account = accounts.find(a => a.id === accountId);
    // Allow spending from loans (it just increases the debt)
    if (type === 'expense' && account && account.type !== 'loan' && numAmount > account.balance) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: `Spending ₹${numAmount.toLocaleString('en-IN')} from ${account.name} (Balance: ₹${account.balance.toLocaleString('en-IN')})`,
      });
      return;
    }

    const selectedDate = new Date(date);
    const now = new Date();
    selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

    addTransaction({
      date: selectedDate.toISOString(),
      description,
      amount: numAmount,
      type,
      category,
      method,
      accountId,
      appName: (type === 'expense' && method === 'online') ? appName : undefined,
      ledgerType: type === 'expense' ? ledgerType : 'personal',
      recipient: (type === 'expense' && ledgerType === 'others') ? recipient : undefined,
    });

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setCategory("General");
    setAppName("");
    setLedgerType("personal");
    setRecipient("");
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="fixed bottom-28 right-6 md:bottom-10 md:right-10 h-16 w-16 rounded-full shadow-[0_10px_40px_rgba(158,158,255,0.4)] bg-accent hover:bg-accent/90 transition-all active:scale-95 z-[90]"
          aria-label="Add Transaction"
        >
          <Plus className="h-8 w-8 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-primary/20 sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">Log {type === 'expense' ? 'Expense' : 'Income'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="flex gap-2 p-1 bg-secondary/30 rounded-xl">
            <Button
              type="button"
              variant={type === "expense" ? "default" : "ghost"}
              className="flex-1 font-headline h-10"
              onClick={() => setType("expense")}
            >
              Expense
            </Button>
            <Button
              type="button"
              variant={type === "income" ? "default" : "ghost"}
              className="flex-1 font-headline h-10"
              onClick={() => setType("income")}
            >
              Income
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-headline uppercase text-muted-foreground">Date</Label>
              <Input
                type="date"
                className="bg-background/50 h-12 font-headline"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-headline uppercase text-muted-foreground">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-headline">₹</span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8 font-headline bg-background/50 h-12"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-headline uppercase text-muted-foreground">Account</Label>
              <select
                className="w-full h-12 px-3 rounded-md bg-background/50 border border-input text-sm"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.type}: ₹{acc.balance.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-headline uppercase text-muted-foreground">Category</Label>
            <select
              className="w-full h-12 px-3 rounded-md bg-background/50 border border-input text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES[type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {type === "expense" && (
            <>
              <div className="space-y-2">
                <Label className="text-[10px] font-headline uppercase text-muted-foreground">Payment Method</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={method === "online" ? "secondary" : "outline"}
                    className="flex-1 h-10 gap-2"
                    onClick={() => setMethod("online")}
                  >
                    <Landmark className="h-4 w-4" /> Online
                  </Button>
                  <Button
                    type="button"
                    variant={method === "cash" ? "secondary" : "outline"}
                    className="flex-1 h-10 gap-2"
                    onClick={() => setMethod("cash")}
                  >
                    <Wallet className="h-4 w-4" /> Cash
                  </Button>
                </div>
              </div>

              {method === 'online' && (
                <div className="space-y-2 animate-fade-in">
                  <Label className="text-[10px] font-headline uppercase text-muted-foreground">Payment App</Label>
                  <select
                    className="w-full h-12 px-3 rounded-md bg-background/50 border border-input text-sm"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select App/Bank</option>
                    {PAYMENT_APPS.map(app => (
                      <option key={app} value={app}>{app}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-[10px] font-headline uppercase text-muted-foreground">Ledger</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={ledgerType === "personal" ? "secondary" : "outline"}
                    className="text-[10px] uppercase font-headline h-10"
                    onClick={() => setLedgerType("personal")}
                  >
                    <User className="h-3 w-3 mr-1" /> Personal
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={ledgerType === "aashram" ? "secondary" : "outline"}
                    className="text-[10px] uppercase font-headline h-10"
                    onClick={() => setLedgerType("aashram")}
                  >
                    < Landmark className="h-3 w-3 mr-1" /> Aashram
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={ledgerType === "others" ? "secondary" : "outline"}
                    className="text-[10px] uppercase font-headline h-10"
                    onClick={() => setLedgerType("others")}
                  >
                    <HelpCircle className="h-3 w-3 mr-1" /> Others
                  </Button>
                </div>
              </div>

              {ledgerType === 'others' && (
                <div className="space-y-2 animate-fade-in">
                  <Label className="text-[10px] font-headline uppercase text-muted-foreground">Recipient Name</Label>
                  <Input
                    placeholder="Who are you paying?"
                    className="bg-background/50 h-12"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                  />
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <Label className="text-[10px] font-headline uppercase text-muted-foreground">Description</Label>
            <Input
              placeholder={type === 'expense' ? "What was this for?" : "Source of income?"}
              className="bg-background/50 h-12"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white font-headline h-14 text-lg shadow-lg shadow-accent/20">
            Record {type === 'expense' ? 'Expense' : 'Income'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
