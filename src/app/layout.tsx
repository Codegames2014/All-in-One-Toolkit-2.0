
import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { LoadingScreen } from "@/components/loading-screen";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "All-in-One Toolkit",
  description: "A collection of useful tools for everyday tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<LoadingScreen />}>
            <AppShell>{children}</AppShell>
          </Suspense>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
