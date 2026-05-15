"use client";

import React from "react";
import { Heart, Search, Calendar, ChevronRight, Trash2 } from "lucide-react";
import { FoodRecord, toggleFavorite, clearLedger } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface LedgerHistoryProps {
  history: FoodRecord[];
  lang: "en" | "ar";
  onUpdate: () => void;
}

export const LedgerHistory = ({ history, lang, onUpdate }: LedgerHistoryProps) => {
  const [search, setSearch] = React.useState("");

  const filtered = history.filter(item => 
    item.foodName.toLowerCase().includes(search.toLowerCase())
  );

  const handleFavorite = (id: string) => {
    toggleFavorite(id);
    onUpdate();
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your ledger history?")) {
      clearLedger();
      onUpdate();
    }
  };

  const labels = {
    title: { en: "The Digital Ledger", ar: "السجل الرقمي" },
    search: { en: "Search your history...", ar: "ابحث في سجلك..." },
    clear: { en: "Clear Ledger", ar: "مسح السجل" },
    empty: { en: "No history found. Start scanning!", ar: "لا يوجد سجل. ابدأ بالمسح!" },
    calories: { en: "kcal", ar: "سعرة" }
  };

  return (
    <div className="px-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-headline font-bold">{labels.title[lang]}</h2>
        <Button variant="ghost" size="sm" onClick={handleClear} className="text-destructive hover:bg-destructive/10">
          <Trash2 className="w-4 h-4 mr-2" />
          <span className="text-xs font-bold">{labels.clear[lang]}</span>
        </Button>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder={labels.search[lang]}
          className="pl-12 h-14 bg-card/40 border-border/50 rounded-2xl text-lg focus:ring-primary focus:border-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <Card key={item.id} className="p-4 bg-card/60 border-border/40 rounded-3xl hover:bg-card transition-all group overflow-hidden relative">
              <div className="flex gap-4 items-center">
                {item.photoUrl ? (
                  <img src={item.photoUrl} alt={item.foodName} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/20" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{item.foodName}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-bold tracking-tight">
                    <span>{format(item.timestamp, "MMM dd, HH:mm")}</span>
                    <span className="text-primary/60">•</span>
                    <span className="text-primary">{item.calories} {labels.calories[lang]}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleFavorite(item.id)}
                    className={`p-2 rounded-xl transition-all ${item.isFavorite ? "bg-red-500/10 text-red-500" : "hover:bg-muted text-muted-foreground"}`}
                  >
                    <Heart className={`w-5 h-5 ${item.isFavorite ? "fill-current" : ""}`} />
                  </button>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            {labels.empty[lang]}
          </div>
        )}
      </div>
    </div>
  );
};
