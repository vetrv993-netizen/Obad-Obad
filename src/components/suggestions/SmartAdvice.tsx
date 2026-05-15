"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, MessageSquare, Lightbulb, ChevronRight, Apple, Activity } from "lucide-react";
import { getPersonalizedNutritionSuggestions, GetPersonalizedNutritionSuggestionsOutput } from "@/ai/flows/get-personalized-nutrition-suggestions-flow";
import { FoodRecord } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SmartAdviceProps {
  history: FoodRecord[];
  lang: "en" | "ar";
}

export const SmartAdvice = ({ history, lang }: SmartAdviceProps) => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<GetPersonalizedNutritionSuggestionsOutput | null>(null);

  const fetchAdvice = async () => {
    if (history.length === 0) return;
    setLoading(true);
    try {
      const formattedHistory = history.slice(0, 5).map(h => ({
        name: h.foodName,
        nutritionInfo: {
          calories: h.calories,
          protein: h.protein,
          carbohydrates: h.carbohydrates,
          fat: h.fat,
        }
      }));
      const result = await getPersonalizedNutritionSuggestions({ foodHistory: formattedHistory });
      setAdvice(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (history.length > 0 && !advice) {
      fetchAdvice();
    }
  }, [history]);

  const labels = {
    title: { en: "NutriScan AI Advice", ar: "نصيحة مسح-ني الذكي" },
    subtitle: { en: "Personalized suggestions based on your history", ar: "اقتراحات مخصصة بناءً على سجلك" },
    meals: { en: "Suggested Next Meals", ar: "الوجبات المقترحة القادمة" },
    refresh: { en: "Update Advice", ar: "تحديث النصائح" },
    noHistory: { en: "Start scanning food to get personalized AI advice!", ar: "ابدأ بمسح الطعام للحصول على نصائح ذكية مخصصة!" }
  };

  if (history.length === 0) {
    return (
      <div className="px-6 py-10 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Activity className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-headline font-bold">{labels.title[lang]}</h2>
          <p className="text-muted-foreground">{labels.noHistory[lang]}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            {labels.title[lang]}
          </h2>
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{labels.subtitle[lang]}</p>
        </div>
        <Button size="icon" variant="ghost" onClick={fetchAdvice} disabled={loading} className="text-primary hover:bg-primary/10">
          <Sparkles className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 rounded-3xl w-full" />
          <Skeleton className="h-60 rounded-3xl w-full" />
        </div>
      ) : advice ? (
        <div className="space-y-6">
          <Card className="p-6 bg-primary/10 border-primary/20 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-20 h-20" />
            </div>
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <MessageSquare className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-widest">The Daily Insight</span>
              </div>
              <p className="text-lg leading-relaxed font-medium">{advice.advice}</p>
            </div>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-headline font-bold flex items-center gap-2">
              <Apple className="w-5 h-5 text-secondary" />
              {labels.meals[lang]}
            </h3>
            <div className="grid gap-3">
              {advice.mealSuggestions.map((meal, i) => (
                <Card key={i} className="p-4 bg-card/40 border-border/40 rounded-2xl flex items-center justify-between hover:bg-card transition-colors cursor-pointer group">
                  <span className="font-medium text-sm">{meal}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
