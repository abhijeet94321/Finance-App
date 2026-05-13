
"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useFinance } from "@/lib/store";
import { Onboarding } from "@/components/dashboard/Onboarding";
import { BalanceGrid } from "@/components/dashboard/BalanceGrid";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { AISpendingAdvisor } from "@/components/dashboard/AISpendingAdvisor";
import { TransactionModal } from "@/components/dashboard/TransactionModal";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, ReceiptText, BarChart3, Settings, ShieldCheck, LogOut, Wallet } from "lucide-react";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";

// Performance Optimization: Dynamic Imports
const TransactionsView = dynamic(() => import("@/components/dashboard/TransactionsView").then(mod => mod.TransactionsView), {
  loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
});

const ReportsView = dynamic(() => import("@/components/dashboard/ReportsView").then(mod => mod.ReportsView), {
  loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
});

const SettingsView = dynamic(() => import("@/components/dashboard/SettingsView").then(mod => mod.SettingsView), {
  loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
});

const AccountsView = dynamic(() => import("@/components/dashboard/AccountsView").then(mod => mod.AccountsView), {
  loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
});

type View = "dashboard" | "transactions" | "accounts" | "reports" | "settings";

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
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-primary/20 rounded-2xl flex items-center justify-center animate-pulse">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-headline uppercase tracking-widest text-muted-foreground animate-pulse">Syncing Ledger...</p>
        </div>
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
      case "accounts":
        return <AccountsView />;
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
                <SidebarMenuButton isActive={currentView === "accounts"} onClick={() => setCurrentView("accounts")}>
                  <Wallet /> <span>Accounts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={currentView === "transactions"} onClick={() => setCurrentView("transactions")}>
                  <ReceiptText /> <span>Ledger</span>
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
          {renderView()}
          <TransactionModal />
        </main>

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
