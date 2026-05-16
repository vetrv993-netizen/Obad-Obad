import React from "react";
import { Card } from "@/components/ui/card";
import { Coffee, Sun, Moon } from "lucide-react";

export interface Meal {
  id: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  items: any[];
  totalCalories: number;
}

export const MealSummary = ({ meals, lang }: { meals: Meal[], lang: "en"|"ar" }) => {
  const isRtl = lang === "ar";
  
  const mealConfig = {
    breakfast: { icon: Coffee, color: "text-orange-400", bg: "bg-orange-400/20", label: isRtl ? "الفطور" : "Breakfast" },
    lunch: { icon: Sun, color: "text-yellow-400", bg: "bg-yellow-400/20", label: isRtl ? "الغداء" : "Lunch" },
    dinner: { icon: Moon, color: "text-indigo-400", bg: "bg-indigo-400/20", label: isRtl ? "العشاء" : "Dinner" },
    snack: { icon: Coffee, color: "text-pink-400", bg: "bg-pink-400/20", label: isRtl ? "وجبة خفيفة" : "Snacks" }
  };

  return (
    <div className="space-y-3">
      {["breakfast", "lunch", "dinner", "snack"].map(type => {
        const mealData = meals.find(m => m.type === type) || { totalCalories: 0, items: [] };
        const conf = mealConfig[type as keyof typeof mealConfig];
        const Icon = conf.icon;

        return (
          <Card key={type} className="p-4 flex items-center justify-between glass-morphism border-white/5">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${conf.bg} ${conf.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">{conf.label}</h4>
                <p className="text-xs text-muted-foreground">{mealData.items.length} {lang === "ar" ? "عناصر" : "items"}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-lg">{Math.round(mealData.totalCalories)}</p>
              <p className="text-[10px] uppercase text-muted-foreground font-bold">Kcal</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
