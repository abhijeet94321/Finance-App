"use client";

import React from "react";
import { FinancialProvider, useFinance } from "@/lib/store";
import { Onboarding } from "@/components/dashboard/Onboarding";
import { BalanceGrid } from "@/components/dashboard/BalanceGrid";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { AISpendingAdvisor } from "@/components/dashboard/AISpendingAdvisor";
import { TransactionModal } from "@/components/dashboard/TransactionModal";
import { ReminderAlert } from "@/components/dashboard/ReminderAlert";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, ReceiptText, BarChart3, Settings, ShieldCheck, LogOut } from "lucide-react";

function SaldoContent() {
  const { onboarded, resetData } = useFinance();

  if (!onboarded) {
    return <Onboarding />;
  }

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
                <SidebarMenuButton isActive tooltip="Dashboard">
                  <LayoutDashboard /> <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Transactions">
                  <ReceiptText /> <span>Transactions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Reports">
                  <BarChart3 /> <span>Real-time Reports</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
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
