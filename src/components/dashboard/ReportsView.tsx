
"use client";

import React, { useMemo } from "react";
import { useFinance } from "@/lib/store";
import { AISpendingAdvisor } from "./AISpendingAdvisor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { BarChart3, TrendingUp, TrendingDown, PieChart as PieChartIcon } from "lucide-react";

export function ReportsView() {
  const { transactions } = useFinance();

  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categories: Record<string, number> = {};
    
    expenses.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const monthlyTrendData = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dayTransactions = transactions.filter(t => isSameDay(new Date(t.date), day));
      const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

      return {
        date: format(day, 'MMM dd'),
        income,
        expense
      };
    });
  }, [transactions]);

  const COLORS = ['#9e9eff', '#7dd3fc', '#c084fc', '#f472b6', '#fb7185', '#38bdf8', '#818cf8'];

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-10 animate-fade-in">
      <header>
        <p className="font-headline text-primary uppercase tracking-widest text-xs mb-1">Advanced Analytics</p>
        <h2 className="text-3xl font-headline font-bold text-white">Financial Intelligence Report</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card border-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-headline uppercase text-muted-foreground flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4 text-primary" /> Category Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #303056', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number) => `₹${value.toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
                    Log expenses to see category split.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card border-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-headline uppercase text-muted-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-accent" /> Monthly Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <div>
                      <p className="text-[10px] uppercase font-headline text-emerald-400">Total Inflow</p>
                      <p className="text-2xl font-headline font-bold text-white">₹{totalIncome.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-emerald-500 opacity-50" />
                  </div>
                  <div className="flex justify-between items-center p-4 bg-rose-500/10 rounded-xl border border-rose-500/20">
                    <div>
                      <p className="text-[10px] uppercase font-headline text-rose-400">Total Outflow</p>
                      <p className="text-2xl font-headline font-bold text-white">₹{totalExpense.toLocaleString()}</p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-rose-500 opacity-50" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card border-white/5">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Spending Trend (Daily)</CardTitle>
              <CardDescription>Visualizing your cash flow throughout the month</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#ffffff50" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#ffffff50" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #303056', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ fill: '#ffffff05' }}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* AI Advisor Section */}
        <div className="lg:col-span-4">
          <AISpendingAdvisor />
        </div>
      </div>
    </div>
  );
}
