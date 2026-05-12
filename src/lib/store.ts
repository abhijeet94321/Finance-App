
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type TransactionType = "income" | "expense";
export type PaymentMethod = "online" | "cash";
export type LedgerType = "personal" | "aashram" | "others";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  method: PaymentMethod;
  accountId: string;
  appName?: string;
  ledgerType: LedgerType;
  recipient?: string;
}

export interface Account {
  id: string;
  name: string;
  type: "bank" | "card" | "cash";
  balance: number;
  lastUpdated: string;
}

interface FinancialData {
  accounts: Account[];
  transactions: Transaction[];
  onboarded: boolean;
}

interface FinancialContextType extends FinancialData {
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  updateAccountBalance: (accountId: string, newBalance: number) => void;
  onboard: (initialAccounts: Account[]) => void;
  resetData: () => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

const STORAGE_KEY = "saldo_financial_data_v1";

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<FinancialData>({
    accounts: [],
    transactions: [],
    onboarded: false,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setData(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const onboard = (initialAccounts: Account[]) => {
    setData({
      accounts: initialAccounts,
      transactions: [],
      onboarded: true,
    });
  };

  const addTransaction = (tx: Omit<Transaction, "id">) => {
    const newTx = { ...tx, id: Math.random().toString(36).substr(2, 9) };
    
    setData((prev) => {
      const updatedAccounts = prev.accounts.map((acc) => {
        if (acc.id === tx.accountId) {
          const balanceDiff = tx.type === "income" ? tx.amount : -tx.amount;
          return {
            ...acc,
            balance: acc.balance + balanceDiff,
            lastUpdated: new Date().toISOString(),
          };
        }
        return acc;
      });

      return {
        ...prev,
        accounts: updatedAccounts,
        transactions: [newTx, ...prev.transactions],
      };
    });
  };

  const updateAccountBalance = (accountId: string, newBalance: number) => {
    setData((prev) => ({
      ...prev,
      accounts: prev.accounts.map((acc) =>
        acc.id === accountId ? { ...acc, balance: newBalance, lastUpdated: new Date().toISOString() } : acc
      ),
    }));
  };

  const resetData = () => {
    setData({ accounts: [], transactions: [], onboarded: false });
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!isLoaded) return null;

  return React.createElement(
    FinancialContext.Provider,
    {
      value: {
        ...data,
        addTransaction,
        updateAccountBalance,
        onboard,
        resetData,
      },
    },
    children
  );
}

export function useFinance() {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinancialProvider");
  }
  return context;
}
