
"use client";

import React, { useState } from "react";
import { FinancialProvider, useFinance } from "@/lib/store";
import { Onboarding } from "@/components/dashboard/Onboarding";
import { BalanceGrid } from "@/components/dashboard/BalanceGrid";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { AISpendingAdvisor } from "@/components/dashboard/AISpendingAdvisor";
import { TransactionModal } from "@/components/dashboard/TransactionModal";
import { ReminderAlert } from "@/components/dashboard/ReminderAlert";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, ReceiptText, BarChart3, Settings, ShieldCheck, LogOut, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

type View = "dashboard" | "transactions" | "reports" | "settings";

function TransactionsView() {
  const { transactions } = useFinance();
  const [search, setSearch] = useState("");

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase()) ||
    t.recipient?.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <p className="font-headline text-primary uppercase tracking-widest text-xs mb-1">Ledger Management</p>
        <h2 className="text-3xl font-headline font-bold text-white">All Transactions</h2>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-secondary/20 p-4 rounded-2xl border border-white/5">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by description, category, or recipient..." 
            className="pl-10 bg-background/50 border-white/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 bg-secondary/50 rounded-xl text-xs font-headline uppercase tracking-wider border border-white/5 flex items-center justify-center gap-2 hover:bg-secondary transition-colors">
            <Filter className="h-3 w-3" /> Filter
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="p-6 text-[10px] font-headline uppercase tracking-widest text-muted-foreground">Date</th>
                <th className="p-6 text-[10px] font-headline uppercase tracking-widest text-muted-foreground">Description</th>
                <th className="p-6 text-[10px] font-headline uppercase tracking-widest text-muted-foreground">Category</th>
                <th className="p-6 text-[10px] font-headline uppercase tracking-widest text-muted-foreground">Method</th>
                <th className="p-6 text-[10px] font-headline uppercase tracking-widest text-muted-foreground text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-muted-foreground italic">No transactions found matching your criteria.</td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                      <div className="text-sm text-white">{format(new Date(tx.date), 'MMM dd, yyyy')}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">{format(new Date(tx.date), 'hh:mm a')}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-medium text-white">{tx.description}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                        {tx.ledgerType.toUpperCase()} {tx.recipient && `• To: ${tx.recipient}`}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-[10px] px-2 py-1 bg-secondary rounded-full text-muted-foreground uppercase tracking-wider">{tx.category}</span>
                    </td>
                    <td className="p-6">
                      <div className="text-sm text-white capitalize">{tx.method}</div>
                      {tx.appName && <div className="text-[10px] text-primary">{tx.appName}</div>}
                    </td>
                    <td className="p-6 text-right">
                      <span className={`font-headline font-bold text-lg ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                        {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SaldoContent() {
  const { onboarded, resetData } = useFinance();
  const [currentView, setCurrentView] = useState<View>("dashboard");

  if (!onboarded) {
    return <Onboarding />;
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <div className="space-y-10 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="font-headline text-primary uppercase tracking-widest text-xs mb-1">Financial Overview</p>
                <h2 className="text-3xl font-headline font-bold text-white">Your Wealth Summary</h2>
              </div>
              <div className="flex gap-2">
                <div className="bg-secondary/50 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-headline uppercase text-muted-foreground tracking-wider">Real-time Live</span>
                </div>
              </div>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-10">
                <BalanceGrid />
                <RecentTransactions />
              </div>
              
              <aside className="lg:col-span-4 space-y-10">
                <AISpendingAdvisor />
                
                <div className="glass-card rounded-[2rem] p-8 border-accent/20 bg-accent/5 overflow-hidden relative">
                  <div className="absolute -bottom-4 -right-4 opacity-10">
                     <BarChart3 className="h-24 w-24 text-accent" />
                  </div>
                  <h4 className="font-headline text-lg text-accent mb-2">Automated Monthly Audit</h4>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Generate a one-click comprehensive report for the current billing cycle.</p>
                  <button className="w-full bg-accent py-3 rounded-xl font-headline font-bold text-white hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
                    Generate Real-time Report
                  </button>
                </div>
              </aside>
            </section>
          </div>
        );
      case "transactions":
        return <TransactionsView />;
      default:
        return <div className="p-20 text-center text-muted-foreground">Module coming soon...</div>;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground font-body">
        <Sidebar className="border-r border-white/5 glass-card">
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
                <SidebarMenuButton 
                  isActive={currentView === "dashboard"} 
                  onClick={() => setCurrentView("dashboard")}
                  tooltip="Dashboard"
                >
                  <LayoutDashboard /> <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentView === "transactions"} 
                  onClick={() => setCurrentView("transactions")}
                  tooltip="Transactions"
                >
                  <ReceiptText /> <span>Transactions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentView === "reports"}
                  onClick={() => setCurrentView("reports")} 
                  tooltip="Reports"
                >
                  <BarChart3 /> <span>Real-time Reports</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentView === "settings"}
                  onClick={() => setCurrentView("settings")}
                  tooltip="Settings"
                >
                  <Settings /> <span>Security & Alerts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            
            <div className="mt-auto p-3">
              <SidebarMenuButton onClick={resetData} className="text-destructive hover:bg-destructive/10">
                <LogOut /> <span>Clear All Records</span>
              </SidebarMenuButton>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-6 md:p-10 lg:px-16 space-y-10 max-w-7xl mx-auto">
          <ReminderAlert />
          {renderView()}
          <TransactionModal />
        </main>
      </div>
    </SidebarProvider>
  );
}

export default function Home() {
  return (
    <FinancialProvider>
      <SaldoContent />
    </FinancialProvider>
  );
}
