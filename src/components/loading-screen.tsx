
"use client";

import { Bot } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
 
  useEffect(() => {
    // Simulate loading progress
    const timer1 = setTimeout(() => setProgress(30), 100);
    const timer2 = setTimeout(() => setProgress(75), 500);
    const timer3 = setTimeout(() => setProgress(100), 1500);
    
    // Hide the loading screen after animation
    const timer4 = setTimeout(() => setVisible(false), 3000);

    return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[101] flex items-center justify-center bg-background transition-opacity duration-500 animate-out fade-out">
      <div className="flex flex-col items-center gap-4 w-64">
        <div className="relative h-16 w-16">
            <Bot className="absolute inset-0 h-16 w-16 animate-pulse text-primary/50" />
            <Bot className="absolute inset-0 h-16 w-16 animate-ping text-primary" />
        </div>
        <p className="text-muted-foreground animate-pulse">Loading Toolkit...</p>
        <Progress value={progress} className="w-full mt-4" />
      </div>
    </div>
  );
}
