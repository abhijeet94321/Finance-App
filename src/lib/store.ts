
"use client";

import React, { createContext, useContext, useMemo } from "react";
import { 
  useUser, 
  useFirestore, 
  useCollection,
  useMemoFirebase 
} from "@/firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  writeBatch, 
  query, 
  orderBy,
  increment,
  updateDoc
} from "firebase/firestore";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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

interface FinancialContextType {
  accounts: Account[];
  transactions: Transaction[];
  onboarded: boolean;
  loading: boolean;
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  updateAccountBalance: (accountId: string, newBalance: number) => void;
  onboard: (initialAccounts: Account[]) => void;
  resetData: () => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const firestore = useFirestore();

  const accountsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'accounts');
  }, [firestore, user]);

  const { data: accounts, loading: accountsLoading } = useCollection<Account>(accountsQuery);

  const transactionsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'transactions'), 
      orderBy('date', 'desc')
    );
  }, [firestore, user]);

  const { data: transactions, loading: transactionsLoading } = useCollection<Transaction>(transactionsQuery);

  const addTransaction = (tx: Omit<Transaction, "id">) => {
    if (!firestore || !user) return;

    const transactionId = Math.random().toString(36).substr(2, 9);
    const txRef = doc(firestore, 'users', user.uid, 'transactions', transactionId);
    const accRef = doc(firestore, 'users', user.uid, 'accounts', tx.accountId);

    const balanceDiff = tx.type === "income" ? tx.amount : -tx.amount;

    // Record transaction
    setDoc(txRef, tx).catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: txRef.path,
        operation: 'create',
        requestResourceData: tx
      }));
    });

    // Update balance
    updateDoc(accRef, {
      balance: increment(balanceDiff),
      lastUpdated: new Date().toISOString()
    }).catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: accRef.path,
        operation: 'update',
        requestResourceData: { balance: increment(balanceDiff) }
      }));
    });
  };

  const onboard = (initialAccounts: Account[]) => {
    if (!firestore || !user) return;

    const batch = writeBatch(firestore);
    initialAccounts.forEach(acc => {
      const accRef = doc(firestore, 'users', user.uid, 'accounts', acc.id);
      batch.set(accRef, acc);
    });

    batch.commit().catch(async (e) => {
      // General error handling for batch
      console.error("Onboarding failed", e);
    });
  };

  const updateAccountBalance = (accountId: string, newBalance: number) => {
    if (!firestore || !user) return;
    const accRef = doc(firestore, 'users', user.uid, 'accounts', accountId);
    updateDoc(accRef, { 
      balance: newBalance, 
      lastUpdated: new Date().toISOString() 
    }).catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: accRef.path,
        operation: 'update',
        requestResourceData: { balance: newBalance }
      }));
    });
  };

  const resetData = () => {
    // Note: Deleting collections in Firestore client side is complex.
    // For MVP, we suggest manually clearing via Firebase Console or implementing a delete loop.
    console.warn("Reset data requested. For safety, this action is restricted in production.");
  };

  const contextValue = useMemo(() => ({
    accounts: accounts || [],
    transactions: transactions || [],
    onboarded: (accounts && accounts.length > 0) || false,
    loading: accountsLoading || transactionsLoading,
    addTransaction,
    updateAccountBalance,
    onboard,
    resetData,
  }), [accounts, transactions, accountsLoading, transactionsLoading]);

  return React.createElement(
    FinancialContext.Provider,
    { value: contextValue },
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
