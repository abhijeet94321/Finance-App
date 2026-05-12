
"use client";

import React, { useState } from "react";
import { useFinance, Transaction } from "@/lib/store";
import { Onboarding } from "@/components/dashboard/Onboarding";
import { BalanceGrid } from "@/components/dashboard/BalanceGrid";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { AISpendingAdvisor } from "@/components/dashboard/AISpendingAdvisor";
import { TransactionModal } from "@/components/dashboard/TransactionModal";
import { ReminderAlert } from "@/components/dashboard/ReminderAlert";
import { ReportsView } from "@/components/dashboard/ReportsView";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, ReceiptText, BarChart3, Settings, ShieldCheck, LogOut, Search, Filter, Download, ArrowUpDown, ArrowUp, ArrowDown, Trash2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
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

type View = "dashboard" | "transactions" | "reports" | "settings";

function SettingsView() {
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
        </div>
      </div>
    </div>
  );
}

function TransactionsView() {
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

  const SortIcon = ({ column }: { column: keyof Transaction }) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    return sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 text-primary" /> : <ArrowDown className="h-3 w-3 ml-1 text-primary" />;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24 md:pb-0">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-headline text-primary uppercase tracking-widest text-xs mb-1">Ledger Management</p>
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-white">Transactions</h2>
        </div>
      </header>

      <div className="flex flex-col gap-4 bg-secondary/20 p-4 rounded-2xl border border-white/5">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-background/50 border-white/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-background/50 border-white/10 flex-1">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="income">In</SelectItem>
              <SelectItem value="expense">Out</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ledgerFilter} onValueChange={setLedgerFilter}>
            <SelectTrigger className="bg-background/50 border-white/10 flex-1">
              <SelectValue placeholder="Ledger" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
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
                <th className="p-4 text-[10px] font-headline uppercase tracking-widest text-muted-foreground" onClick={() => handleSort('date')}>Date</th>
                <th className="p-4 text-[10px] font-headline uppercase tracking-widest text-muted-foreground">Description</th>
                <th className="p-4 text-[10px] font-headline uppercase tracking-widest text-muted-foreground text-right" onClick={() => handleSort('amount')}>Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-xs text-white">{format(new Date(tx.date), 'MMM dd')}</td>
                  <td className="p-4">
                    <div className="font-medium text-xs text-white truncate max-w-[100px]">{tx.description}</div>
                    <div className="text-[9px] text-muted-foreground uppercase">{tx.category}</div>
                  </td>
                  <td className="p-4 text-right">
                    <span className={`font-headline font-bold text-xs ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SaldoContent() {
  const { onboarded, loading } = useFinance();
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const auth = useAuth();

  const handleLogout = () => {
    if (auth) signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!onboarded) {
    return <Onboarding />;
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <div className="space-y-10 animate-fade-in pb-24 md:pb-0">
            <header className="flex items-center justify-between">
              <div>
                <p className="font-headline text-primary uppercase tracking-widest text-xs mb-1">Financial Overview</p>
                <h2 className="text-2xl font-headline font-bold text-white">Summary</h2>
              </div>
              <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/20">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
            </header>

            <section className="space-y-10">
              <BalanceGrid />
              <RecentTransactions />
              <AISpendingAdvisor />
            </section>
          </div>
        );
      case "transactions":
        return <TransactionsView />;
      case "reports":
        return <ReportsView />;
      case "settings":
        return <SettingsView />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground font-body">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex border-r border-white/5 glass-card">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-primary-foreground h-5 w-5" />
              </div>
              <h1 className="font-headline text-2xl font-bold tracking-tight text-white">Saldo</h1>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={currentView === "dashboard"} onClick={() => setCurrentView("dashboard")}>
                  <LayoutDashboard /> <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={currentView === "transactions"} onClick={() => setCurrentView("transactions")}>
                  <ReceiptText /> <span>Transactions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={currentView === "reports"} onClick={() => setCurrentView("reports")}>
                  <BarChart3 /> <span>Reports</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={currentView === "settings"} onClick={() => setCurrentView("settings")}>
                  <Settings /> <span>Security</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className="mt-auto p-3">
              <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:bg-destructive/10">
                <LogOut /> <span>Sign Out</span>
              </SidebarMenuButton>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-6 md:p-10 lg:px-16 space-y-6 md:space-y-10 max-w-7xl mx-auto w-full relative">
          <ReminderAlert />
          {renderView()}
          <TransactionModal />
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav currentView={currentView} onViewChange={setCurrentView} />
      </div>
    </SidebarProvider>
  );
}

export default function Home() {
  return (
    <AuthGuard>
      <SaldoContent />
    </AuthGuard>
  );
}
