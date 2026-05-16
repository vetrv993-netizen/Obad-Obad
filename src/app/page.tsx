"use client";

import React, { useState, useEffect } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { VisionScanner } from "@/components/scanner/VisionScanner";
import { Insights } from "@/components/dashboard/Insights";
import { LedgerHistory } from "@/components/history/LedgerHistory";
import { SmartAdvice } from "@/components/suggestions/SmartAdvice";
import { NutritionCalculator } from "@/components/calculator/NutritionCalculator";
import { getLedger, FoodRecord } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { Zap, Trophy, Flame } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [history, setHistory] = useState<FoodRecord[]>([]);

  useEffect(() => {
    setHistory(getLedger());
  }, []);

  const refreshHistory = () => {
    setHistory(getLedger());
  };

  const labels = {
    welcome: { en: "Welcome back!", ar: "مرحباً بعودتك!" },
    streak: { en: "Day Streak", ar: "سلسلة أيام" },
    points: { en: "Health Points", ar: "نقاط الصحة" },
    active: { en: "Active Calories", ar: "سعرات نشطة" }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* Quick Stats Banner */}
            <div className="px-6 py-4">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-6 rounded-[2.5rem] border border-white/5 space-y-4">
                <p className="text-sm font-bold uppercase tracking-widest text-primary/80">{labels.welcome[lang]}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500/20 p-2 rounded-xl text-orange-500">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-[10px] uppercase font-black text-muted-foreground">{labels.streak[lang]}</p>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-white/10" />
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-500/20 p-2 rounded-xl text-yellow-500">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">4,820</p>
                      <p className="text-[10px] uppercase font-black text-muted-foreground">{labels.points[lang]}</p>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-white/10" />
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-xl text-blue-500">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">850</p>
                      <p className="text-[10px] uppercase font-black text-muted-foreground">{labels.active[lang]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Insights history={history} lang={lang} />
          </div>
        );
      case "scanner":
        return (
          <VisionScanner 
            lang={lang} 
            onSuccess={() => {
              refreshHistory();
              setActiveTab("history");
            }} 
          />
        );
      case "history":
        return <LedgerHistory history={history} lang={lang} onUpdate={refreshHistory} />;
      case "ai":
        return <SmartAdvice history={history} lang={lang} />;
      case "settings":
        return (
          <div className="px-6 py-10 text-center space-y-4">
            <h2 className="text-2xl font-headline font-bold">Profile & Settings</h2>
            <p className="text-muted-foreground">Customization and APK export settings coming soon.</p>
            <Card className="p-8 border-dashed border-2 bg-muted/20 rounded-3xl">
              <p className="text-sm text-muted-foreground italic tracking-wide">
                Bilingual UI Dashboard v1.0.4<br/>
                Firestore Cloud Sync Active
              </p>
            </Card>
          </div>
        );
      case "calculator":
        return <NutritionCalculator lang={lang} />;
      default:
        return null;
    }
  };

  return (
    <div className="mobile-shell bg-background shadow-2xl ring-1 ring-white/5">
      <MobileShell 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        lang={lang} 
        setLang={setLang}
      >
        {renderContent()}
      </MobileShell>
    </div>
  );
}
