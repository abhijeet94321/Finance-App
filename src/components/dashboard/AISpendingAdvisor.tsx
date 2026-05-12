"use client";

import React, { useState } from "react";
import { useFinance } from "@/lib/store";
import { getSpendingReductionSuggestions, SpendingReductionSuggestionsOutput } from "@/ai/flows/spending-reduction-suggestions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BrainCircuit, ChevronRight, TrendingDown, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function AISpendingAdvisor() {
  const { transactions, accounts } = useFinance();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SpendingReductionSuggestionsOutput | null>(null);

  const totalMonthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleAnalyze = async () => {
    if (transactions.length === 0) return;
    setLoading(true);
    try {
      const result = await getSpendingReductionSuggestions({
        transactions: transactions.map(t => ({
          date: t.date,
          description: t.description,
          amount: t.amount,
          type: t.type,
          category: t.category
        })),
        monthlyIncome: totalMonthlyIncome,
        financialGoals: "Reduce non-essential spending and optimize utility bills."
      });
      setSuggestions(result);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card border-primary/20 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle className="font-headline text-xl text-primary flex items-center gap-2">
            <BrainCircuit className="h-5 w-5" /> Saldo AI Strategist
          </CardTitle>
          <CardDescription>Intelligent analysis of your spending patterns</CardDescription>
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleAnalyze} 
          disabled={loading || transactions.length < 3}
          className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
        >
          {loading ? "Thinking..." : "Analyze Spend"}
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : suggestions ? (
          <div className="grid gap-4 animate-fade-in">
            {suggestions.suggestions.map((s, idx) => (
              <div key={idx} className="bg-secondary/20 p-4 rounded-xl border border-white/5 group hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-headline uppercase tracking-wider text-primary px-2 py-0.5 bg-primary/10 rounded-full">{s.category}</span>
                  <span className="text-sm font-headline text-accent font-semibold flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" /> {s.potentialSavings}
                  </span>
                </div>
                <p className="font-medium mb-1">{s.recommendation}</p>
                <div className="flex items-start gap-2 mt-2">
                  <Info className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.reasoning}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-secondary/10 rounded-2xl border border-dashed border-white/5">
            <TrendingDown className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-20" />
            <p className="text-sm text-muted-foreground">
              {transactions.length < 3 
                ? "Log at least 3 transactions for AI analysis." 
                : "Tap 'Analyze Spend' to get personalized cost-reduction tips."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
