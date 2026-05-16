"use client";

import React, { useState, useEffect } from "react";
import { Camera, History, LayoutDashboard, Sparkles, Languages, Settings, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MobileShellProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: "en" | "ar";
  setLang: (lang: "en" | "ar") => void;
}

export const MobileShell = ({ children, activeTab, setActiveTab, lang, setLang }: MobileShellProps) => {
  const isRtl = lang === "ar";

  const tabs = [
    { id: "dashboard", icon: LayoutDashboard, label: { en: "Home", ar: "الرئيسية" } },
    { id: "calculator", icon: Calculator, label: { en: "Calc", ar: "حاسبة" } },
    { id: "scanner", icon: Camera, label: { en: "Scan", ar: "مسح" }, primary: true },
    { id: "history", icon: History, label: { en: "History", ar: "السجل" } },
    { id: "ai", icon: Sparkles, label: { en: "Advice", ar: "نصائح" } },
  ];

  return (
    <div className="flex flex-col h-full bg-background" dir={isRtl ? "rtl" : "ltr"}>
      {/* Top Bar */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-border/50 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <h1 className="text-2xl font-headline font-bold text-primary flex items-center gap-2">
          Nutri<span className="text-foreground">Scan</span>
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
        >
          <Languages className="w-4 h-4" />
          <span className="text-xs font-bold uppercase">{lang === "en" ? "العربية" : "English"}</span>
        </Button>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 glass-morphism h-20 px-4 flex justify-around items-center z-50 rounded-t-[2rem]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (tab.primary) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative -top-8 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl",
                  isActive 
                    ? "bg-primary text-primary-foreground scale-110 shadow-primary/40 ring-4 ring-background" 
                    : "bg-primary/90 text-primary-foreground hover:scale-105"
                )}
              >
                <Icon className="w-8 h-8" />
                <span className="sr-only">{tab.label[lang]}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-200 px-2 py-1 rounded-xl",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label[lang]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
