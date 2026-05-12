
"use client";

import React from "react";
import { useUser, useAuth } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, LogIn } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const auth = useAuth();

  const handleLogin = () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(console.error);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-primary/20 rounded-xl"></div>
          <div className="h-4 w-32 bg-secondary/50 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background animate-fade-in">
        <Card className="max-w-md w-full glass-card border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
              <ShieldCheck className="text-primary-foreground h-10 w-10" />
            </div>
            <CardTitle className="text-3xl font-headline font-bold text-white">Welcome to Saldo</CardTitle>
            <CardDescription className="text-lg">Secure, real-time financial tracking for your daily needs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-sm text-muted-foreground">
              Sign in to sync your accounts and transactions across all your devices.
            </p>
            <Button 
              onClick={handleLogin}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-headline font-semibold h-12 text-lg gap-2"
            >
              <LogIn className="h-5 w-5" /> Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
