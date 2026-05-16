import React from "react";
import { Progress } from "@/components/ui/progress";

interface MacroChartProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  lang: "en" | "ar";
}

export const MacroChart = ({ calories, protein, carbs, fat, lang }: MacroChartProps) => {
  const maxCalories = 2200; // Target
  const maxProtein = 150;
  const maxCarbs = 250;
  const maxFat = 70;

  const calPct = Math.min((calories / maxCalories) * 100, 100);
  const pPct = Math.min((protein / maxProtein) * 100, 100);
  const cPct = Math.min((carbs / maxCarbs) * 100, 100);
  const fPct = Math.min((fat / maxFat) * 100, 100);

  const labels = {
    calories: lang === "ar" ? "سعرات" : "Calories",
    protein: lang === "ar" ? "بروتين" : "Protein",
    carbs: lang === "ar" ? "كارب" : "Carbs",
    fat: lang === "ar" ? "دهون" : "Fat"
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4 col-span-2 bg-gradient-to-br from-card/40 to-background/40 p-5 rounded-2xl border border-white/5">
        <div className="flex justify-between items-end">
          <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{labels.calories}</p>
          <div className="text-right">
            <span className="text-2xl font-black text-primary">{Math.round(calories)}</span>
            <span className="text-xs text-muted-foreground ml-1">/ {maxCalories} kcal</span>
          </div>
        </div>
        <Progress value={calPct} className="h-3" />
      </div>

      <div className="space-y-2 bg-gradient-to-br from-card/40 to-background/40 p-4 rounded-2xl border border-white/5">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-blue-400">{labels.protein}</span>
          <span>{Math.round(protein)}g</span>
        </div>
        <Progress value={pPct} className="h-2 [&>div]:bg-blue-400" />
      </div>

      <div className="space-y-2 bg-gradient-to-br from-card/40 to-background/40 p-4 rounded-2xl border border-white/5">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-orange-400">{labels.carbs}</span>
          <span>{Math.round(carbs)}g</span>
        </div>
        <Progress value={cPct} className="h-2 [&>div]:bg-orange-400" />
      </div>

      <div className="space-y-2 bg-gradient-to-br from-card/40 to-background/40 p-4 rounded-2xl border border-white/5 col-span-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-yellow-400">{labels.fat}</span>
          <span>{Math.round(fat)}g</span>
        </div>
        <Progress value={fPct} className="h-2 [&>div]:bg-yellow-400" />
      </div>
    </div>
  );
};
