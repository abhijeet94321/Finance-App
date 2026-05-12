
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';
import { FinancialProvider } from '@/lib/store';
import { InstallPrompt } from '@/components/dashboard/InstallPrompt';

export const metadata: Metadata = {
  title: 'Saldo - Smart Financial Tracking',
  description: 'Manage your wealth with penny-perfect precision and AI insights.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Saldo',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
        <FirebaseClientProvider>
          <FinancialProvider>
            {children}
            <InstallPrompt />
            <Toaster />
          </FinancialProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
